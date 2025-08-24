"""
IROAS BOSS System - Dashboard Schemas
ダッシュボード用Pydanticスキーマ (P-001対応)
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from decimal import Decimal


class AlertItem(BaseModel):
    """アラート項目"""
    type: str  # error, warning, info
    message: str


class GrowthRates(BaseModel):
    """成長率データ"""
    sales: float
    active_members: int
    suspended_members: int
    withdrawn_members: int
    revenue: float


class DashboardStats(BaseModel):
    """ダッシュボード統計データ"""
    monthly_sales: Decimal
    active_members: int
    suspended_members: int
    withdrawn_members: int
    unpaid_count: int
    total_revenue: Decimal
    growth_rates: GrowthRates
    alerts: List[AlertItem]

    class Config:
        from_attributes = True


class ChartData(BaseModel):
    """チャートデータ"""
    labels: List[str]
    sales: List[Decimal]
    members: List[int]

    class Config:
        from_attributes = True