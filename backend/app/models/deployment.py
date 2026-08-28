import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DeploymentStatus(str, enum.Enum):
    PENDING = "pending"
    BUILDING = "building"
    DEPLOYING = "deploying"
    SUCCESS = "success"
    FAILED = "failed"
    CANCELLED = "cancelled"


class Deployment(Base):
    """
    A single deployment run of an application
    into one of its environments.
    """

    __tablename__ = "deployments"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    environment_id: Mapped[int] = mapped_column(
        ForeignKey("environments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    triggered_by_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    commit_sha: Mapped[str | None] = mapped_column(
        String(40),
        nullable=True,
    )

    branch: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    status: Mapped[DeploymentStatus] = mapped_column(
        Enum(DeploymentStatus, name="deployment_status"),
        default=DeploymentStatus.PENDING,
        nullable=False,
        index=True,
    )

    logs_url: Mapped[str | None] = mapped_column(
        String(512),
        nullable=True,
    )

    error_message: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    finished_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    # ------------------------------------------------------
    # Relationships
    # ------------------------------------------------------

    application = relationship(
        "Application",
        back_populates="deployments",
    )

    environment = relationship(
        "Environment",
        back_populates="deployments",
    )

    triggered_by = relationship(
        "User",
        back_populates="deployments",
    )

    logs = relationship(
        "DeploymentLog",
        back_populates="deployment",
        cascade="all, delete-orphan",
        order_by="DeploymentLog.timestamp",
    )

    def __repr__(self) -> str:
        return (
            f"<Deployment id={self.id} "
            f"application_id={self.application_id} "
            f"status={self.status}>"
        )


class DeploymentLog(Base):
    """
    Individual log lines for a deployment, used to stream
    build/deploy output back to the frontend.
    """

    __tablename__ = "deployment_logs"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    deployment_id: Mapped[int] = mapped_column(
        ForeignKey("deployments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    log_line: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ------------------------------------------------------
    # Relationships
    # ------------------------------------------------------

    deployment = relationship(
        "Deployment",
        back_populates="logs",
    )

    def __repr__(self) -> str:
        return f"<DeploymentLog deployment_id={self.deployment_id}>"
