from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Session(Base):
    """
    Backend platform session, created after a successful
    GitHub OAuth login.

    Replaces the in-memory `sessions = {}` dict in
    app/api/auth.py so sessions survive a backend restart.

    The `id` column IS the session_id that gets set as
    the `session_id` cookie value.
    """

    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(
        String(36),  # uuid4 string
        primary_key=True,
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # NOTE: never store the raw GitHub OAuth access token.
    # Encrypt it (e.g. with `cryptography.fernet.Fernet`,
    # already in requirements.txt) before saving here, and
    # decrypt only when making a GitHub API call on the
    # user's behalf.
    access_token_encrypted: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )

    # ------------------------------------------------------
    # Relationships
    # ------------------------------------------------------

    user = relationship(
        "User",
        back_populates="sessions",
    )

    def __repr__(self) -> str:
        return f"<Session id={self.id} user_id={self.user_id}>"
