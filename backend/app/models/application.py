import enum
from datetime import datetime, timezone

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DeploymentType(str, enum.Enum):
    """
    Mirrors the three options in Deploy.jsx's
    "Deployment method" step.
    """

    AUTO = "auto"
    DOCKER = "docker"
    CUSTOM = "custom"


class Application(Base):
    """
    A platform application, created from the Deploy.jsx
    configuration form.

    This is what `POST /applications` (the endpoint the
    frontend is currently just alert()-ing about) should
    create.
    """

    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # GitHub repo id + full_name (owner/repo), not a local FK,
    # since repos live on GitHub, not in our DB
    repository_id: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
    )

    repository_full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    default_branch: Mapped[str] = mapped_column(
        String(255),
        default="main",
        nullable=False,
    )

    deployment_type: Mapped[DeploymentType] = mapped_column(
        Enum(DeploymentType, name="deployment_type"),
        default=DeploymentType.AUTO,
        nullable=False,
    )

    installation_id: Mapped[int] = mapped_column(
        ForeignKey(
            "github_installations.id",
            ondelete="RESTRICT",
        ),
        nullable=False,
    )

    owner_user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ------------------------------------------------------
    # Relationships
    # ------------------------------------------------------

    installation = relationship(
        "GitHubInstallation",
        back_populates="applications",
    )

    owner = relationship(
        "User",
        back_populates="applications",
    )

    environments = relationship(
        "Environment",
        back_populates="application",
        cascade="all, delete-orphan",
    )

    deployments = relationship(
        "Deployment",
        back_populates="application",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Application id={self.id} name={self.name!r}>"
