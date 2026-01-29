import uuid
from datetime import datetime
from typing import TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY

from app.db.database import Base

if TYPE_CHECKING:
    from app.models.user import User


class APIKey(Base):
    """API keys for programmatic access."""
    __tablename__ = "api_keys"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    # Key storage - store hash, show prefix only
    key_hash: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    key_prefix: Mapped[str] = mapped_column(String(20), nullable=False)  # e.g., "ps_live_abc1"

    # Metadata
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    scopes: Mapped[list[str]] = mapped_column(ARRAY(String), default=list, nullable=False)

    # Lifecycle
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="api_keys")

    @property
    def is_expired(self) -> bool:
        """Check if the API key has expired."""
        if self.expires_at is None:
            return False
        return datetime.utcnow() > self.expires_at

    @property
    def is_valid(self) -> bool:
        """Check if the API key is valid (not revoked and not expired)."""
        return not self.is_revoked and not self.is_expired
