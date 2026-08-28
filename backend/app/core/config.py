import os

from pathlib import Path

from dotenv import load_dotenv


# Project root directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent


# Load environment variables from .env
load_dotenv(
    BASE_DIR / ".env"
)


class Settings:
    # ========================================================
    # GitHub App
    # ========================================================

    GITHUB_APP_ID = os.getenv(
        "GITHUB_APP_ID"
    )

    GITHUB_PRIVATE_KEY_PATH = os.getenv(
        "GITHUB_PRIVATE_KEY_PATH",
        "secrets/github-app-private-key.pem",
    )

    # ========================================================
    # GitHub OAuth
    # ========================================================

    GITHUB_CLIENT_ID = os.getenv(
        "GITHUB_CLIENT_ID"
    )

    GITHUB_CLIENT_SECRET = os.getenv(
        "GITHUB_CLIENT_SECRET"
    )

    GITHUB_REDIRECT_URI = os.getenv(
        "GITHUB_REDIRECT_URI"
    )

    # ========================================================
    # Frontend
    # ========================================================

    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173",
    )

    # ========================================================
    # Computed paths
    # ========================================================

    @property
    def github_private_key_full_path(self) -> Path:
        """
        Return the absolute path of the
        GitHub App private key.
        """

        return (
            BASE_DIR
            / self.GITHUB_PRIVATE_KEY_PATH
        )


settings = Settings()