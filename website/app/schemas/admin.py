from datetime import datetime
from uuid import UUID
from pydantic import BaseModel

from app.schemas.user import UserResponse
from app.schemas.subscription import SubscriptionResponse


class DashboardStats(BaseModel):
    total_customers: int
    active_subscriptions: int
    revenue_today: float
    revenue_this_month: float
    revenue_total: float
    new_customers_today: int
    new_customers_this_month: int
    # Download & Installation stats
    total_downloads: int = 0
    total_installations: int = 0
    active_installations: int = 0


class CustomerWithSubscription(BaseModel):
    user: UserResponse
    subscription: SubscriptionResponse | None
    total_spent: float

    class Config:
        from_attributes = True


class CustomerListResponse(BaseModel):
    customers: list[CustomerWithSubscription]
    total: int
    page: int
    per_page: int
    total_pages: int
