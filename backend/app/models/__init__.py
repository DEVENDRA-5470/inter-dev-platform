# Import every model here so that Alembic's autogenerate
# (and `Base.metadata.create_all`) can discover all tables
# just by importing `app.models`.

from app.models.user import User  # noqa: F401
from app.models.session import Session  # noqa: F401
from app.models.github_installation import GitHubInstallation  # noqa: F401
from app.models.application import Application, DeploymentType  # noqa: F401
from app.models.environment import Environment, EnvironmentName  # noqa: F401
from app.models.deployment import (  # noqa: F401
    Deployment,
    DeploymentLog,
    DeploymentStatus,
)

__all__ = [
    "User",
    "Session",
    "GitHubInstallation",
    "Application",
    "DeploymentType",
    "Environment",
    "EnvironmentName",
    "Deployment",
    "DeploymentLog",
    "DeploymentStatus",
]
