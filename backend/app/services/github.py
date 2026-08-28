import httpx

from app.services.github_app import (
    create_installation_access_token,
)


GITHUB_API_URL = "https://api.github.com"


async def get_installation_repositories(
    installation_id: int,
) -> list[dict]:
    """
    Get repositories accessible by a GitHub App installation.
    """

    token_data = await create_installation_access_token(
        installation_id
    )

    installation_token = token_data["token"]

    headers = {
        "Authorization": f"Bearer {installation_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient(
        timeout=20.0
    ) as client:

        response = await client.get(
            f"{GITHUB_API_URL}/installation/repositories",
            headers=headers,
        )

    response.raise_for_status()

    data = response.json()

    return data.get(
        "repositories",
        [],
    )


async def get_repository(
    installation_id: int,
    owner: str,
    repo: str,
) -> dict:
    """
    Get details of a specific repository.
    """

    token_data = await create_installation_access_token(
        installation_id
    )

    installation_token = token_data["token"]

    headers = {
        "Authorization": f"Bearer {installation_token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }

    async with httpx.AsyncClient(
        timeout=20.0
    ) as client:

        response = await client.get(
            f"{GITHUB_API_URL}/repos/{owner}/{repo}",
            headers=headers,
        )

    response.raise_for_status()

    return response.json()