"""Add sync_metadata table

Revision ID: 8b2c3d4e5f6g
Revises: 7a1b2c3d4e5f
Create Date: 2026-01-29

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = '8b2c3d4e5f6g'
down_revision: Union[str, Sequence[str], None] = '7a1b2c3d4e5f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create sync_metadata table for cloud sync tracking."""
    op.create_table('sync_metadata',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('installation_id', sa.UUID(), nullable=False),
        sa.Column('last_sync_at', sa.DateTime(), nullable=False),
        sa.Column('last_push_at', sa.DateTime(), nullable=True),
        sa.Column('last_pull_at', sa.DateTime(), nullable=True),
        sa.Column('sync_version', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['installation_id'], ['installations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('installation_id')
    )


def downgrade() -> None:
    """Drop sync_metadata table."""
    op.drop_table('sync_metadata')
