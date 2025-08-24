"""
IROAS BOSS System - API Router
全APIエンドポイントのルーティング設定
"""

from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    dashboard,
    members, 
    payments,
    reports,
    auth
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router, 
    prefix="/auth", 
    tags=["認証"]
)

api_router.include_router(
    dashboard.router, 
    prefix="/dashboard", 
    tags=["ダッシュボード"]
)

api_router.include_router(
    members.router, 
    prefix="/members", 
    tags=["会員管理"]
)

api_router.include_router(
    payments.router, 
    prefix="/payments", 
    tags=["決済管理"]
)

api_router.include_router(
    reports.router, 
    prefix="/reports", 
    tags=["レポート"]
)