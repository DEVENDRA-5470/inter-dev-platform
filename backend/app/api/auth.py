import secrets
import uuid
from urllib.parse import urlencode

import httpx

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse

from app.core.config import settings


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# MVP STORAGE
# ============================================================

# OAuth states for CSRF protection
oauth_states = set()


# Session storage
#
# {
#     "session_id": {
#         "access_token": "...",
#         "user": {
#             "id": ...,
#             "login": "...",
#             "name": "...",
#             "avatar_url": "..."
#         }
#     }
# }
#
# IMPORTANT:
# This is in-memory storage.
# Restarting backend will delete all sessions.
# Later replace with Redis/database.
sessions = {}


# ============================================================
# GITHUB LOGIN
# ============================================================

@router.get("/github")
async def github_login():
    """
    Redirect user to GitHub OAuth authorization page.
    """

    state = secrets.token_urlsafe(32)

    oauth_states.add(state)

    params = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
        "state": state,
    }

    authorization_url = (
        "https://github.com/login/oauth/authorize?"
        + urlencode(params)
    )

    print("\n==============================")
    print("GITHUB LOGIN STARTED")
    print("REDIRECT URI:", settings.GITHUB_REDIRECT_URI)
    print("AUTH URL:", authorization_url)
    print("==============================\n")

    return RedirectResponse(
        url=authorization_url,
        status_code=302,
    )


# ============================================================
# GITHUB CALLBACK
# ============================================================

@router.get("/github/callback")
async def github_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    error_description: str | None = None,
):
    """
    GitHub OAuth callback.

    1. Validate OAuth state
    2. Exchange code for GitHub access token
    3. Fetch GitHub user
    4. Create backend session
    5. Set session cookie
    6. Redirect to frontend dashboard
    """

    print("\n==============================")
    print("GITHUB CALLBACK RECEIVED")
    print("CODE RECEIVED:", bool(code))
    print("STATE RECEIVED:", state)
    print("ERROR:", error)
    print("==============================\n")

    # --------------------------------------------------------
    # GitHub authorization denied
    # --------------------------------------------------------

    if error:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "GitHub authorization failed",
                "error": error,
                "description": error_description,
            },
        )

    # --------------------------------------------------------
    # Validate required parameters
    # --------------------------------------------------------

    if not code or not state:
        raise HTTPException(
            status_code=400,
            detail="Missing OAuth code or state",
        )

    # --------------------------------------------------------
    # Validate OAuth state
    # --------------------------------------------------------

    if state not in oauth_states:
        raise HTTPException(
            status_code=400,
            detail="Invalid or expired OAuth state",
        )

    # State should only be used once
    oauth_states.remove(state)

    # --------------------------------------------------------
    # Exchange authorization code for access token
    # --------------------------------------------------------

    token_url = "https://github.com/login/oauth/access_token"

    token_payload = {
        "client_id": settings.GITHUB_CLIENT_ID,
        "client_secret": settings.GITHUB_CLIENT_SECRET,
        "code": code,
        "redirect_uri": settings.GITHUB_REDIRECT_URI,
    }

    headers = {
        "Accept": "application/json",
    }

    async with httpx.AsyncClient(
        timeout=20.0
    ) as client:

        print("EXCHANGING GITHUB CODE FOR TOKEN...")

        token_response = await client.post(
            token_url,
            data=token_payload,
            headers=headers,
        )

        print(
            "TOKEN RESPONSE STATUS:",
            token_response.status_code,
        )

        if token_response.status_code != 200:
            try:
                error_data = token_response.json()
            except Exception:
                error_data = token_response.text

            raise HTTPException(
                status_code=400,
                detail={
                    "message": "GitHub token exchange failed",
                    "status_code": token_response.status_code,
                    "github_response": error_data,
                },
            )

        token_data = token_response.json()

        if "access_token" not in token_data:
            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Failed to get GitHub access token",
                    "github_response": token_data,
                },
            )

        access_token = token_data["access_token"]

        # ----------------------------------------------------
        # Fetch authenticated GitHub user
        # ----------------------------------------------------

        print("FETCHING GITHUB USER...")

        user_response = await client.get(
            "https://api.github.com/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
            },
        )

        print(
            "USER RESPONSE STATUS:",
            user_response.status_code,
        )

        if user_response.status_code != 200:
            try:
                error_data = user_response.json()
            except Exception:
                error_data = user_response.text

            raise HTTPException(
                status_code=400,
                detail={
                    "message": "Failed to fetch GitHub user",
                    "status_code": user_response.status_code,
                    "github_response": error_data,
                },
            )

        github_user = user_response.json()

    # ========================================================
    # CREATE PLATFORM SESSION
    # ========================================================

    session_id = str(uuid.uuid4())

    sessions[session_id] = {
        "access_token": access_token,
        "user": {
            "id": github_user.get("id"),
            "login": github_user.get("login"),
            "name": github_user.get("name"),
            "avatar_url": github_user.get("avatar_url"),
        },
    }

    print("\n==============================")
    print("SESSION CREATED SUCCESSFULLY")
    print("SESSION ID:", session_id)
    print("GITHUB USER:", github_user.get("login"))
    print("TOTAL SESSIONS:", len(sessions))
    print("==============================\n")

    # ========================================================
    # REDIRECT TO FRONTEND
    # ========================================================

    response = RedirectResponse(
        url=f"{settings.FRONTEND_URL}/dashboard",
        status_code=302,
    )

    # ========================================================
    # SET SESSION COOKIE
    # ========================================================

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,

        # Works for localhost frontend/backend during development
        samesite="lax",

        # False locally because HTTP
        secure=False,

        max_age=86400,

        path="/",
    )

    print("COOKIE SET: session_id")
    print("REDIRECTING TO:", f"{settings.FRONTEND_URL}/dashboard")

    return response


# ============================================================
# CURRENT AUTHENTICATED USER
# ============================================================

@router.get("/me")
async def get_current_user(
    request: Request,
):
    """
    Return currently authenticated user.
    """

    print("\n==============================")
    print("AUTH /ME REQUEST")
    print("ALL COOKIES:", request.cookies)

    session_id = request.cookies.get(
        "session_id"
    )

    print("SESSION ID:", session_id)

    if not session_id:
        print("RESULT: NO SESSION COOKIE")
        print("==============================\n")

        raise HTTPException(
            status_code=401,
            detail="Not authenticated",
        )

    session = sessions.get(
        session_id
    )

    print(
        "SESSION FOUND:",
        session is not None,
    )

    if not session:
        print("RESULT: SESSION NOT FOUND")
        print("AVAILABLE SESSIONS:", list(sessions.keys()))
        print("==============================\n")

        raise HTTPException(
            status_code=401,
            detail="Session expired",
        )

    print(
        "AUTHENTICATED USER:",
        session["user"].get("login"),
    )

    print("==============================\n")

    return {
        "authenticated": True,
        "user": session["user"],
    }


# ============================================================
# LOGOUT
# ============================================================

@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
):
    """
    Destroy current backend session and remove cookie.
    """

    session_id = request.cookies.get(
        "session_id"
    )

    print("\n==============================")
    print("LOGOUT REQUEST")
    print("SESSION ID:", session_id)

    if session_id:
        sessions.pop(
            session_id,
            None,
        )

        print("SESSION REMOVED")

    response.delete_cookie(
        key="session_id",
        path="/",
    )

    print("COOKIE DELETED")
    print("==============================\n")

    return {
        "message": "Logged out successfully",
    }