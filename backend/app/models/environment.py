import enum

from sqlalchemy import Boolean, Enum, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class EnvironmentName(str, enum.Enum):
    """
    Mirrors the three options in Deploy.jsx's
    "Deployment environment" step.
    """

    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"


class Environment(Base):
    """
    One deployment target (dev / staging / production)
    belonging to an application.

    An application can have up to one row per
    EnvironmentName -- enforce that with the unique
    constraint below.
    """

    __tablename__ = "environments"
    __table_args__ = (
        # one row per (application, environment name)
        UniqueConstraint(
            "application_id",
            "name",
            name="uq_environment_application_name",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    application_id: Mapped[int] = mapped_column(
        ForeignKey("applications.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name: Mapped[EnvironmentName] = mapped_column(
        Enum(EnvironmentName, name="environment_name"),
        nullable=False,
    )

    branch: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # ------------------------------------------------------
    # Relationships
    # ------------------------------------------------------

    application = relationship(
        "Application",
        back_populates="environments",
    )

    deployments = relationship(
        "Deployment",
        back_populates="environment",
    )

    def __repr__(self) -> str:
        return (
            f"<Environment id={self.id} "
            f"application_id={self.application_id} "
            f"name={self.name}>"
        )
