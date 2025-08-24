"""
IROAS BOSS System - Member Model
会員情報テーブル (MF000, MF100対応)
"""

from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, DateTime, Boolean, Text, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum as PyEnum

from .base import Base


class MemberStatus(PyEnum):
    """会員ステータス"""
    ACTIVE = "active"          # アクティブ
    SUSPENDED = "suspended"    # 休会
    WITHDRAWN = "withdrawn"    # 退会
    PENDING = "pending"        # 承認待ち


class Member(Base):
    """会員マスタテーブル"""
    __tablename__ = "members"
    
    # 基本情報
    id: Mapped[int] = mapped_column(Integer, primary_key=True, comment="会員ID")
    member_code: Mapped[str] = mapped_column(
        String(20), unique=True, index=True, comment="会員コード"
    )
    
    # 個人情報
    family_name: Mapped[str] = mapped_column(String(50), comment="姓")
    given_name: Mapped[str] = mapped_column(String(50), comment="名")
    family_name_kana: Mapped[Optional[str]] = mapped_column(String(100), comment="姓（カナ）")
    given_name_kana: Mapped[Optional[str]] = mapped_column(String(100), comment="名（カナ）")
    
    # 連絡先
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, comment="メールアドレス")
    phone: Mapped[Optional[str]] = mapped_column(String(15), comment="電話番号")
    postal_code: Mapped[Optional[str]] = mapped_column(String(8), comment="郵便番号")
    prefecture: Mapped[Optional[str]] = mapped_column(String(10), comment="都道府県")
    city: Mapped[Optional[str]] = mapped_column(String(50), comment="市区町村")
    address_line: Mapped[Optional[str]] = mapped_column(String(200), comment="住所")
    
    # MLM組織情報
    sponsor_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("members.id"), comment="スポンサーID"
    )
    upline_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("members.id"), comment="アップラインID"  
    )
    organization_level: Mapped[int] = mapped_column(
        Integer, default=1, comment="組織レベル"
    )
    binary_position: Mapped[Optional[str]] = mapped_column(
        String(1), comment="バイナリーポジション (L/R)"
    )
    
    # ステータス
    status: Mapped[str] = mapped_column(
        String(20), default=MemberStatus.PENDING.value, comment="会員ステータス"
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, comment="アクティブフラグ")
    
    # 日付情報
    registration_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), comment="登録日"
    )
    activation_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), comment="アクティベート日"
    )
    suspension_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), comment="休会日"
    )
    withdrawal_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), comment="退会日"
    )
    
    # 決済情報
    bank_name: Mapped[Optional[str]] = mapped_column(String(50), comment="銀行名")
    branch_name: Mapped[Optional[str]] = mapped_column(String(50), comment="支店名")
    account_type: Mapped[Optional[str]] = mapped_column(String(10), comment="口座種別")
    account_number: Mapped[Optional[str]] = mapped_column(String(20), comment="口座番号")
    account_holder: Mapped[Optional[str]] = mapped_column(String(100), comment="口座名義")
    
    # 累計情報
    total_sales: Mapped[Optional[int]] = mapped_column(
        Numeric(15, 2), default=0, comment="累計売上"
    )
    total_rewards: Mapped[Optional[int]] = mapped_column(
        Numeric(15, 2), default=0, comment="累計報酬"
    )
    
    # メモ・備考
    notes: Mapped[Optional[str]] = mapped_column(Text, comment="備考")
    
    # リレーション
    sponsor: Mapped[Optional["Member"]] = relationship(
        "Member", remote_side=[id], foreign_keys=[sponsor_id], back_populates="sponsored_members"
    )
    sponsored_members: Mapped[List["Member"]] = relationship(
        "Member", back_populates="sponsor", foreign_keys=[sponsor_id]
    )
    
    upline: Mapped[Optional["Member"]] = relationship(
        "Member", remote_side=[id], foreign_keys=[upline_id], back_populates="downline_members"
    )
    downline_members: Mapped[List["Member"]] = relationship(
        "Member", back_populates="upline", foreign_keys=[upline_id]
    )
    
    # 他テーブルとのリレーション
    payments = relationship("Payment", back_populates="member")
    rewards = relationship("Reward", back_populates="member")
    
    @property
    def full_name(self) -> str:
        """フルネーム"""
        return f"{self.family_name} {self.given_name}"
    
    @property
    def full_name_kana(self) -> Optional[str]:
        """フルネーム（カナ）"""
        if self.family_name_kana and self.given_name_kana:
            return f"{self.family_name_kana} {self.given_name_kana}"
        return None
    
    def __repr__(self) -> str:
        return f"<Member(id={self.id}, code={self.member_code}, name={self.full_name})>"