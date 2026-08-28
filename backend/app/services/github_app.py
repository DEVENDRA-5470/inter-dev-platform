import time
import jwt
import httpx

from app.core.config import settings


GITHUB_API_URL = "https://api.github.com"


def generate_github_app_jwt() -> str:
    """
    Generate a short-lived JWT used to authenticate
    the GitHub App itself.
    """

    private_key_path = settings.github_private_key_full_path

    if not private_key_path.exists():
        raise FileNotFoundError(
            f"GitHub private key not found at: {private_key_path}"
        )

    private_key = private_key_path.read_text()

    now = int(time.time())

    payload = {
        "iat": now - 60,
        "exp": now + (9 * 60),
        "iss": settings.GITHUB_APP_ID,
    }

    token = jwt.encode(
        payload,
        private_key,
        algorithm="RS256",
    )

    return token


async def get_github_app() -> dict:
    """
    Verify that GitHub accepts our App JWT.
    """

    app_jwt = generate_github_app_jwt()

    headers = {
        "Authorization": f"Bearer {app_jwt}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API_URL}/app",
            headers=headers,
        )

    response.raise_for_status()

    return response.json()


async def get_installation(
    installation_id: int,
) -> dict:
    """
    Get information about a GitHub App installation.
    """

    app_jwt = generate_github_app_jwt()

    headers = {
        "Authorization": f"Bearer {app_jwt}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API_URL}/app/installations/{installation_id}",
            headers=headers,
        )

    response.raise_for_status()

    return response.json()


async def create_installation_access_token(
    installation_id: int,
) -> dict:
    """
    Create a temporary installation access token.
    """

    app_jwt = generate_github_app_jwt()

    headers = {
        "Authorization": f"Bearer {app_jwt}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{GITHUB_API_URL}/app/installations/"
            f"{installation_id}/access_tokens",
            headers=headers,
        )

    response.raise_for_status()

    return response.json()


async def get_installation_repositories(
    installation_token: str,
) -> list[dict]:
    """
    Fetch repositories accessible to the installation.
    """

    headers = {
        "Authorization": f"Bearer {installation_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API_URL}/installation/repositories",
            headers=headers,
        )

    response.raise_for_status()

    data = response.json()

    return data.get("repositories", [])