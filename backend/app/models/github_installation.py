from datetime import datetime, timezone

from sqlalchemy import BigInteger, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class GitHubInstallation(Base):
    """
    A GitHub App installation on a user or org account.

    Tracked so we don't have to call
    GET /app/installations every time we need to know
    which installation_id to use for a given repository.
    """

    __tablename__ = "github_installations"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True,
    )

    # GitHub's own installation id
    # (used in URLs like /app/installations/{installation_id})
    installation_id: Mapped[int] = mapped_column(
        BigInteger,
        unique=True,
        index=True,
        nullable=False,
    )

    account_login: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    account_id: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
    )

    # "User" or "Organization"
    account_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    repository_selection: Mapped[str | None] = mapped_column(
        String(20),  # "all" or "selected"
        nullable=True,
    )

    installed_by_user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # ------------------------------------------------------
    # Relationships
    # ------------------------------------------------------

    installed_by = relationship(
        "User",
        back_populates="installations",
    )

    applications = relationship(
        "Application",
        back_populates="installation",
    )

    def __repr__(self) -> str:
        return (
            f"<GitHubInstallation installation_id={self.installation_id} "
            f"account_login={self.account_login!r}>"
        )
