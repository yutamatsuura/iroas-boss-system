"""
IROAS BOSS System - Dashboard API
ダッシュボード用APIエンドポイント (P-001対応)
"""

from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    ダッシュボード統計データ取得
    P-001 ダッシュボードで使用
    """
    # TODO: 実際のデータベースクエリを実装
    return {
        "monthly_sales": 2856000,
        "active_members": 1247,
        "suspended_members": 89,
        "withdrawn_members": 34,
        "unpaid_count": 15,
        "total_revenue": 485600,
        "growth_rates": {
            "sales": 12.3,
            "active_members": 23,
            "suspended_members": 5,
            "withdrawn_members": 8,
            "revenue": 8.7
        },
        "alerts": [
            {
                "type": "error",
                "message": "未決済アラート: 15件の未決済があります。月次処理前に確認してください。"
            },
            {
                "type": "info", 
                "message": "月次処理予定: 2025年8月31日に月次処理を実行予定です。"
            },
            {
                "type": "warning",
                "message": "会員数更新: 新規会員が23名増加しました。"
            }
        ]
    }


@router.get("/chart-data")
async def get_chart_data(
    period: str = "monthly",
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    チャート用データ取得
    月次売上推移等のグラフデータ
    """
    # TODO: 実際のデータベースクエリを実装
    if period == "monthly":
        return {
            "labels": ["2024年1月", "2024年2月", "2024年3月", "2024年4月", "2024年5月", "2024年6月"],
            "sales": [2200000, 2350000, 2580000, 2420000, 2680000, 2856000],
            "members": [1180, 1205, 1220, 1198, 1224, 1247]
        }
    
    return {"message": "Invalid period specified"}