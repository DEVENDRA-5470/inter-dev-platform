import time

import httpx
import jwt

from fastapi import APIRouter, HTTPException, Request

from app.api.auth import sessions
from app.core.config import settings


GITHUB_API_URL = "https://api.github.com"
GITHUB_API_VERSION = "2022-11-28"


router = APIRouter(
    prefix="/github",
    tags=["GitHub"],
)


# ============================================================
# GITHUB APP JWT
# ============================================================

def generate_github_app_jwt() -> str:
    """
    Generate a short-lived JWT used to authenticate
    as the GitHub App.
    """

    private_key_path = settings.github_private_key_full_path

    if not private_key_path.exists():
        raise HTTPException(
            status_code=500,
            detail=(
                "GitHub App private key file not found: "
                f"{private_key_path}"
            ),
        )

    if not settings.GITHUB_APP_ID:
        raise HTTPException(
            status_code=500,
            detail="GITHUB_APP_ID is not configured",
        )

    try:
        private_key = private_key_path.read_text(
            encoding="utf-8"
        )
    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to read GitHub App private key: "
                f"{str(error)}"
            ),
        )

    now = int(time.time())

    payload = {
        "iat": now - 60,
        "exp": now + (9 * 60),
        "iss": settings.GITHUB_APP_ID,
    }

    try:
        return jwt.encode(
            payload,
            private_key,
            algorithm="RS256",
        )

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=(
                "Failed to generate GitHub App JWT: "
                f"{str(error)}"
            ),
        )


# ============================================================
# GITHUB HEADERS
# ============================================================

def get_github_headers(token: str) -> dict:
    """
    Create standard GitHub API headers.
    """

    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": GITHUB_API_VERSION,
    }


def get_github_app_headers() -> dict:
    """
    Create headers authenticated as the GitHub App.
    """

    app_jwt = generate_github_app_jwt()

    return get_github_headers(
        app_jwt
    )


# ============================================================
# GITHUB REQUEST HELPER
# ============================================================

async def github_request(
    method: str,
    url: str,
    headers: dict,
    json: dict | None = None,
) -> httpx.Response:
    """
    Execute a GitHub API request with consistent
    timeout and network error handling.
    """

    try:
        async with httpx.AsyncClient(
            timeout=20.0
        ) as client:

            response = await client.request(
                method=method,
                url=url,
                headers=headers,
                json=json,
            )

        return response

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="GitHub API request timed out",
        )

    except httpx.RequestError as error:
        raise HTTPException(
            status_code=502,
            detail={
                "message": "Failed to connect to GitHub API",
                "error": str(error),
            },
        )


# ============================================================
# GITHUB ERROR HELPER
# ============================================================

def raise_github_error(
    response: httpx.Response,
    message: str,
):
    """
    Convert a failed GitHub API response into
    a FastAPI HTTPException.
    """

    try:
        error_data = response.json()

    except Exception:
        error_data = response.text

    raise HTTPException(
        status_code=response.status_code,
        detail={
            "message": message,
            "github_response": error_data,
        },
    )


# ============================================================
# GITHUB APP INSTALLATION TOKEN
# ============================================================

async def create_installation_token(
    installation_id: int,
) -> dict:
    """
    Create a temporary GitHub App installation token.

    This token stays inside the backend.
    """

    app_headers = get_github_app_headers()

    response = await github_request(
        method="POST",
        url=(
            f"{GITHUB_API_URL}"
            f"/app/installations/"
            f"{installation_id}"
            f"/access_tokens"
        ),
        headers=app_headers,
    )

    if response.status_code != 201:
        raise_github_error(
            response,
            "Failed to create installation access token",
        )

    token_data = response.json()

    if not token_data.get("token"):
        raise HTTPException(
            status_code=500,
            detail=(
                "GitHub did not return an "
                "installation access token"
            ),
        )

    return token_data


# ============================================================
# TEST GITHUB APP
# ============================================================

@router.get("/app")
async def get_github_app():
    """
    Test GitHub App authentication.
    """

    headers = get_github_app_headers()

    response = await github_request(
        method="GET",
        url=f"{GITHUB_API_URL}/app",
        headers=headers,
    )

    if response.status_code != 200:
        raise_github_error(
            response,
            "Failed to authenticate GitHub App",
        )

    github_app = response.json()

    return {
        "authenticated": True,
        "app": {
            "id": github_app.get("id"),
            "slug": github_app.get("slug"),
            "name": github_app.get("name"),
            "owner": github_app.get(
                "owner",
                {},
            ).get("login"),
        },
    }


# ============================================================
# GITHUB APP INSTALLATIONS
# ============================================================

@router.get("/installations")
async def get_installations():
    """
    Get all installations of this GitHub App.
    """

    headers = get_github_app_headers()

    response = await github_request(
        method="GET",
        url=f"{GITHUB_API_URL}/app/installations",
        headers=headers,
    )

    if response.status_code != 200:
        raise_github_error(
            response,
            "Failed to fetch GitHub App installations",
        )

    installations = response.json()

    return {
        "count": len(installations),
        "installations": [
            {
                "id": installation.get("id"),
                "account": installation.get(
                    "account",
                    {},
                ).get("login"),
                "account_id": installation.get(
                    "account",
                    {},
                ).get("id"),
                "account_type": installation.get(
                    "account",
                    {},
                ).get("type"),
                "repository_selection": installation.get(
                    "repository_selection"
                ),
            }
            for installation in installations
        ],
    }


# ============================================================
# CREATE INSTALLATION ACCESS TOKEN
# ============================================================

@router.post(
    "/installations/{installation_id}/access-token"
)
async def create_installation_access_token(
    installation_id: int,
):
    """
    Test installation token creation.

    The actual token is never returned.
    """

    token_data = await create_installation_token(
        installation_id
    )

    return {
        "installation_id": installation_id,
        "token_created": True,
        "expires_at": token_data.get(
            "expires_at"
        ),
    }


# ============================================================
# INSTALLATION REPOSITORIES
# ============================================================

@router.get(
    "/installations/{installation_id}/repositories"
)
async def get_installation_repositories(
    installation_id: int,
):
    """
    Fetch repositories accessible to a specific
    GitHub App installation.

    The installation token remains backend-only.
    """

    token_data = await create_installation_token(
        installation_id
    )

    installation_token = token_data["token"]

    headers = get_github_headers(
        installation_token
    )

    repositories = []

    page = 1
    per_page = 100

    while True:

        response = await github_request(
            method="GET",
            url=(
                f"{GITHUB_API_URL}"
                f"/installation/repositories"
                f"?per_page={per_page}"
                f"&page={page}"
            ),
            headers=headers,
        )

        if response.status_code != 200:
            raise_github_error(
                response,
                "Failed to fetch installation repositories",
            )

        data = response.json()

        page_repositories = data.get(
            "repositories",
            [],
        )

        repositories.extend(
            page_repositories
        )

        if len(page_repositories) < per_page:
            break

        page += 1

    return {
        "installation_id": installation_id,
        "repository_count": len(
            repositories
        ),
        "repositories": [
            {
                "id": repository.get("id"),
                "name": repository.get("name"),
                "full_name": repository.get(
                    "full_name"
                ),
                "private": repository.get(
                    "private"
                ),
                "default_branch": repository.get(
                    "default_branch"
                ),
                "html_url": repository.get(
                    "html_url"
                ),
            }
            for repository in repositories
        ],
    }


# ============================================================
# LOGGED-IN USER REPOSITORIES
# ============================================================

@router.get("/repositories")
async def get_user_repositories(
    request: Request,
):
    """
    Fetch repositories for the currently
    authenticated OAuth user.

    Uses the GitHub OAuth access token stored
    in the platform session.
    """

    print("\n==============================")
    print("FETCHING USER REPOSITORIES")

    # --------------------------------------------------------
    # Get platform session
    # --------------------------------------------------------

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
        print(
            "AVAILABLE SESSIONS:",
            list(sessions.keys()),
        )
        print("==============================\n")

        raise HTTPException(
            status_code=401,
            detail="Session expired",
        )

    # --------------------------------------------------------
    # Get OAuth access token
    # --------------------------------------------------------

    access_token = session.get(
        "access_token"
    )

    if not access_token:
        print("RESULT: NO GITHUB ACCESS TOKEN")
        print("==============================\n")

        raise HTTPException(
            status_code=401,
            detail="GitHub access token not found",
        )

    # --------------------------------------------------------
    # GitHub API request
    # --------------------------------------------------------

    headers = get_github_headers(
        access_token
    )

    repositories = []

    page = 1
    per_page = 100

    while True:

        response = await github_request(
            method="GET",
            url=(
                f"{GITHUB_API_URL}"
                f"/user/repos"
                f"?per_page={per_page}"
                f"&page={page}"
                f"&sort=updated"
                f"&direction=desc"
            ),
            headers=headers,
        )

        if response.status_code != 200:

            raise_github_error(
                response,
                "Failed to fetch user repositories",
            )

        page_data = response.json()

        repositories.extend(
            page_data
        )

        if len(page_data) < per_page:
            break

        page += 1

    print(
        "TOTAL REPOSITORIES:",
        len(repositories),
    )

    print("==============================\n")

    # --------------------------------------------------------
    # Return safe repository data
    # --------------------------------------------------------

    return {
        "count": len(repositories),
        "repositories": [
            {
                "id": repository.get(
                    "id"
                ),
                "name": repository.get(
                    "name"
                ),
                "full_name": repository.get(
                    "full_name"
                ),
                "private": repository.get(
                    "private"
                ),
                "description": repository.get(
                    "description"
                ),
                "html_url": repository.get(
                    "html_url"
                ),
                "clone_url": repository.get(
                    "clone_url"
                ),
                "ssh_url": repository.get(
                    "ssh_url"
                ),
                "default_branch": repository.get(
                    "default_branch"
                ),
                "language": repository.get(
                    "language"
                ),
                "updated_at": repository.get(
                    "updated_at"
                ),
                "owner": {
                    "login": repository.get(
                        "owner",
                        {},
                    ).get("login"),
                    "avatar_url": repository.get(
                        "owner",
                        {},
                    ).get("avatar_url"),
                },
            }
            for repository in repositories
        ],
    }