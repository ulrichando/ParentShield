"""Cloud sync service for storing and retrieving device settings."""

from datetime import datetime
from uuid import UUID
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import (
    Installation,
    BlockedApp,
    WebFilterConfig,
    WebFilterRule,
    ScreenTimeConfig,
    SyncMetadata,
)


class SyncService:
    """Service for bi-directional sync of parental control settings."""

    @staticmethod
    async def get_or_create_sync_metadata(
        db: AsyncSession,
        installation_id: UUID,
    ) -> SyncMetadata:
        """Get or create sync metadata for an installation."""
        result = await db.execute(
            select(SyncMetadata).where(SyncMetadata.installation_id == installation_id)
        )
        metadata = result.scalar_one_or_none()

        if not metadata:
            metadata = SyncMetadata(
                installation_id=installation_id,
                last_sync_at=datetime.utcnow(),
            )
            db.add(metadata)
            await db.commit()
            await db.refresh(metadata)

        return metadata

    @staticmethod
    async def push_settings(
        db: AsyncSession,
        installation: Installation,
        blocked_sites: list[str] | None = None,
        blocked_games: list[str] | None = None,
        blocked_apps: list[dict] | None = None,
        schedules: dict | None = None,
    ) -> dict:
        """
        Push settings from device to cloud.

        This saves the device's current settings to the database.
        """
        # Handle blocked sites (as domain rules in web filter)
        if blocked_sites is not None:
            # Get or create web filter config
            result = await db.execute(
                select(WebFilterConfig).where(WebFilterConfig.installation_id == installation.id)
            )
            web_filter = result.scalar_one_or_none()

            if not web_filter:
                web_filter = WebFilterConfig(
                    installation_id=installation.id,
                    is_enabled=True,
                    blocked_categories=[],
                )
                db.add(web_filter)
                await db.commit()
                await db.refresh(web_filter)

            # Clear existing custom rules and add new ones
            await db.execute(
                delete(WebFilterRule).where(WebFilterRule.config_id == web_filter.id)
            )

            for site in blocked_sites:
                rule = WebFilterRule(
                    config_id=web_filter.id,
                    url_pattern=site,
                    is_blocked=True,
                    is_enabled=True,
                )
                db.add(rule)

        # Handle blocked games/apps
        if blocked_games is not None or blocked_apps is not None:
            # Clear existing blocked apps for this installation
            await db.execute(
                delete(BlockedApp).where(BlockedApp.installation_id == installation.id)
            )

            # Add blocked games
            if blocked_games:
                for game in blocked_games:
                    app = BlockedApp(
                        installation_id=installation.id,
                        app_name=game,
                        app_identifier=game,
                        platform=installation.platform.value,
                        is_game=True,
                        is_enabled=True,
                    )
                    db.add(app)

            # Add blocked apps (more detailed)
            if blocked_apps:
                for app_data in blocked_apps:
                    app = BlockedApp(
                        installation_id=installation.id,
                        app_name=app_data.get("app_name", "Unknown"),
                        app_identifier=app_data.get("app_identifier", ""),
                        platform=app_data.get("platform", installation.platform.value),
                        is_game=app_data.get("is_game", False),
                        is_enabled=app_data.get("is_enabled", True),
                        schedule=app_data.get("schedule"),
                    )
                    db.add(app)

        # Update sync metadata
        metadata = await SyncService.get_or_create_sync_metadata(db, installation.id)
        metadata.last_push_at = datetime.utcnow()
        metadata.last_sync_at = datetime.utcnow()
        metadata.sync_version += 1

        await db.commit()

        return {
            "success": True,
            "sync_version": metadata.sync_version,
            "last_sync": metadata.last_sync_at.isoformat(),
        }

    @staticmethod
    async def pull_settings(
        db: AsyncSession,
        installation: Installation,
    ) -> dict:
        """
        Pull settings from cloud to device.

        Returns the current cloud-stored settings for this device.
        """
        # Get blocked sites from web filter rules
        blocked_sites = []
        result = await db.execute(
            select(WebFilterConfig).where(WebFilterConfig.installation_id == installation.id)
        )
        web_filter = result.scalar_one_or_none()

        if web_filter:
            rules_result = await db.execute(
                select(WebFilterRule).where(
                    WebFilterRule.config_id == web_filter.id,
                    WebFilterRule.is_blocked == True,
                    WebFilterRule.is_enabled == True,
                )
            )
            rules = rules_result.scalars().all()
            blocked_sites = [rule.url_pattern for rule in rules]

        # Get blocked apps/games
        result = await db.execute(
            select(BlockedApp).where(
                BlockedApp.installation_id == installation.id,
                BlockedApp.is_enabled == True,
            )
        )
        blocked_app_records = result.scalars().all()

        blocked_games = [app.app_identifier for app in blocked_app_records if app.is_game]
        blocked_apps = [
            {
                "app_name": app.app_name,
                "app_identifier": app.app_identifier,
                "platform": app.platform,
                "is_game": app.is_game,
                "is_enabled": app.is_enabled,
                "schedule": app.schedule,
            }
            for app in blocked_app_records
        ]

        # Get screen time config
        screen_time = None
        result = await db.execute(
            select(ScreenTimeConfig).where(ScreenTimeConfig.installation_id == installation.id)
        )
        screen_time_config = result.scalar_one_or_none()

        if screen_time_config:
            screen_time = {
                "is_enabled": screen_time_config.is_enabled,
                "daily_limits": {
                    "monday": screen_time_config.monday_limit,
                    "tuesday": screen_time_config.tuesday_limit,
                    "wednesday": screen_time_config.wednesday_limit,
                    "thursday": screen_time_config.thursday_limit,
                    "friday": screen_time_config.friday_limit,
                    "saturday": screen_time_config.saturday_limit,
                    "sunday": screen_time_config.sunday_limit,
                },
                "allowed_start_time": screen_time_config.allowed_start_time.isoformat() if screen_time_config.allowed_start_time else None,
                "allowed_end_time": screen_time_config.allowed_end_time.isoformat() if screen_time_config.allowed_end_time else None,
                "grace_period": screen_time_config.grace_period,
            }

        # Update sync metadata
        metadata = await SyncService.get_or_create_sync_metadata(db, installation.id)
        metadata.last_pull_at = datetime.utcnow()
        metadata.last_sync_at = datetime.utcnow()
        await db.commit()

        return {
            "success": True,
            "blocked_sites": blocked_sites,
            "blocked_games": blocked_games,
            "blocked_apps": blocked_apps,
            "screen_time": screen_time,
            "schedules": {},  # TODO: Implement schedule sync
            "last_sync": metadata.last_sync_at.isoformat(),
            "sync_version": metadata.sync_version,
        }

    @staticmethod
    async def get_sync_status(
        db: AsyncSession,
        installation_id: UUID,
    ) -> dict | None:
        """Get sync status for an installation."""
        result = await db.execute(
            select(SyncMetadata).where(SyncMetadata.installation_id == installation_id)
        )
        metadata = result.scalar_one_or_none()

        if not metadata:
            return None

        return {
            "last_sync_at": metadata.last_sync_at.isoformat(),
            "last_push_at": metadata.last_push_at.isoformat() if metadata.last_push_at else None,
            "last_pull_at": metadata.last_pull_at.isoformat() if metadata.last_pull_at else None,
            "sync_version": metadata.sync_version,
        }
