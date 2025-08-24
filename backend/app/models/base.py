"""
IROAS BOSS System - Base Model
全テーブル共通の基底クラス
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
import uuid


class Base(DeclarativeBase):
    """Base class for all database models"""
    
    # 共通カラム
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        server_default=func.now(),
        comment="作成日時"
    )
    
    updated_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        onupdate=func.now(),
        comment="更新日時"
    )
    
    def __repr__(self) -> str:
        """String representation"""
        return f"<{self.__class__.__name__}(id={getattr(self, 'id', 'N/A')})>"