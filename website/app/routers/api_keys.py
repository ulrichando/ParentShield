"""Customer API key management endpoints."""

from datetime import datetime, timedelta
from uuid import UUID
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy import select

from app.core.dependencies import ActiveUser, DbSession
from app.core.security import generate_api_key, hash_token
from app.models import APIKey


router = APIRouter(prefix="/api/v1/api-keys", tags=["API Keys"])


# ============================================================================
# SCHEMAS
# ============================================================================

class CreateAPIKeyRequest(BaseModel):
    """Request to create a new API key."""
    name: str = Field(..., min_length=1, max_length=100, description="A friendly name for this API key")
    scopes: list[str] = Field(default=["read"], description="Permissions for this key")
    expires_in_days: int | None = Field(default=None, ge=1, le=365, description="Days until expiration (null = never)")


class APIKeyResponse(BaseModel):
    """API key response (without the actual key)."""
    id: str
    name: str
    key_prefix: str
    scopes: list[str]
    expires_at: str | None
    is_revoked: bool
    last_used_at: str | None
    created_at: str

    @classmethod
    def from_model(cls, api_key: APIKey) -> "APIKeyResponse":
        return cls(
            id=str(api_key.id),
            name=api_key.name,
            key_prefix=api_key.key_prefix,
            scopes=api_key.scopes or [],
            expires_at=api_key.expires_at.isoformat() if api_key.expires_at else None,
            is_revoked=api_key.is_revoked,
            last_used_at=api_key.last_used_at.isoformat() if api_key.last_used_at else None,
            created_at=api_key.created_at.isoformat(),
        )


class CreateAPIKeyResponse(APIKeyResponse):
    """Response when creating an API key (includes the actual key, shown only once)."""
    key: str = Field(..., description="The full API key - save this, it won't be shown again!")


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/", response_model=CreateAPIKeyResponse, status_code=status.HTTP_201_CREATED)
async def create_api_key(
    request: CreateAPIKeyRequest,
    current_user: ActiveUser,
    db: DbSession,
):
    """
    Create a new API key.

    The full API key is only returned once upon creation.
    Make sure to save it securely - it cannot be retrieved later.
    """
    # Generate the key
    full_key, display_prefix = generate_api_key()
    key_hash = hash_token(full_key)

    # Calculate expiration
    expires_at = None
    if request.expires_in_days:
        expires_at = datetime.utcnow() + timedelta(days=request.expires_in_days)

    # Create the API key record
    api_key = APIKey(
        user_id=current_user.id,
        key_hash=key_hash,
        key_prefix=display_prefix,
        name=request.name,
        scopes=request.scopes,
        expires_at=expires_at,
    )

    db.add(api_key)
    await db.commit()
    await db.refresh(api_key)

    return CreateAPIKeyResponse(
        id=str(api_key.id),
        name=api_key.name,
        key=full_key,  # Only time we return the full key
        key_prefix=api_key.key_prefix,
        scopes=api_key.scopes or [],
        expires_at=api_key.expires_at.isoformat() if api_key.expires_at else None,
        is_revoked=api_key.is_revoked,
        last_used_at=None,
        created_at=api_key.created_at.isoformat(),
    )


@router.get("/", response_model=list[APIKeyResponse])
async def list_api_keys(
    current_user: ActiveUser,
    db: DbSession,
):
    """List all API keys for the current user."""
    result = await db.execute(
        select(APIKey)
        .where(APIKey.user_id == current_user.id)
        .order_by(APIKey.created_at.desc())
    )
    api_keys = result.scalars().all()

    return [APIKeyResponse.from_model(key) for key in api_keys]


@router.get("/{key_id}", response_model=APIKeyResponse)
async def get_api_key(
    key_id: UUID,
    current_user: ActiveUser,
    db: DbSession,
):
    """Get details of a specific API key."""
    result = await db.execute(
        select(APIKey).where(
            APIKey.id == key_id,
            APIKey.user_id == current_user.id,
        )
    )
    api_key = result.scalar_one_or_none()

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found",
        )

    return APIKeyResponse.from_model(api_key)


@router.delete("/{key_id}", status_code=status.HTTP_204_NO_CONTENT)
async def revoke_api_key(
    key_id: UUID,
    current_user: ActiveUser,
    db: DbSession,
):
    """
    Revoke an API key.

    The key will be marked as revoked and can no longer be used for authentication.
    """
    result = await db.execute(
        select(APIKey).where(
            APIKey.id == key_id,
            APIKey.user_id == current_user.id,
        )
    )
    api_key = result.scalar_one_or_none()

    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="API key not found",
        )

    if api_key.is_revoked:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="API key is already revoked",
        )

    api_key.is_revoked = True
    await db.commit()

    return None


@router.get("/scopes/available")
async def list_available_scopes():
    """List all available API key scopes."""
    return {
        "scopes": [
            {"id": "read", "name": "Read", "description": "Read access to your data"},
            {"id": "write", "name": "Write", "description": "Write access to modify settings"},
            {"id": "devices", "name": "Devices", "description": "Manage devices and installations"},
            {"id": "alerts", "name": "Alerts", "description": "Access alert data"},
            {"id": "sync", "name": "Sync", "description": "Cloud sync functionality"},
        ]
    }
