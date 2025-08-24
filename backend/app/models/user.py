"""
IROAS BOSS System - User Model
システム管理者用ユーザーテーブル
"""

from typing import Optional
from sqlalchemy import String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from enum import Enum as PyEnum

from .base import Base


class UserRole(PyEnum):
    """ユーザー権限"""
    ADMIN = "admin"         # 管理者
    OPERATOR = "operator"   # オペレーター
    VIEWER = "viewer"       # 閲覧者


class User(Base):
    """システムユーザーテーブル"""
    __tablename__ = "users"
    
    # 基本情報
    id: Mapped[int] = mapped_column(Integer, primary_key=True, comment="ユーザーID")
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, comment="メールアドレス"
    )
    hashed_password: Mapped[str] = mapped_column(String(255), comment="ハッシュ化パスワード")
    full_name: Mapped[str] = mapped_column(String(100), comment="フルネーム")
    
    # 権限・ステータス
    role: Mapped[str] = mapped_column(
        String(20), default=UserRole.VIEWER.value, comment="ユーザー権限"
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, comment="アクティブフラグ")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"