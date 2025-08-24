"""
IROAS BOSS System - Reward Models
報酬計算・支払いテーブル (MLM報酬システム対応)
"""

from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, Integer, DateTime, Boolean, Text, Numeric, ForeignKey, Date, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum as PyEnum
from decimal import Decimal

from .base import Base


class RewardType(PyEnum):
    """報酬種別"""
    BINARY_BONUS = "binary_bonus"          # バイナリーボーナス
    UNILEVEL_BONUS = "unilevel_bonus"      # ユニレベルボーナス
    LEADERSHIP_BONUS = "leadership_bonus"   # リーダーシップボーナス
    SPECIAL_BONUS = "special_bonus"        # 特別ボーナス


class RewardStatus(PyEnum):
    """報酬ステータス"""
    CALCULATED = "calculated"    # 計算済み
    APPROVED = "approved"       # 承認済み
    PAID = "paid"              # 支払済み
    CANCELLED = "cancelled"    # キャンセル
    CARRIED_OVER = "carried_over"  # 繰越


class Reward(Base):
    """報酬テーブル"""
    __tablename__ = "rewards"
    
    # 基本情報
    id: Mapped[int] = mapped_column(Integer, primary_key=True, comment="報酬ID")
    member_id: Mapped[int] = mapped_column(
        ForeignKey("members.id"), nullable=False, comment="会員ID"
    )
    
    # 報酬期間
    reward_period: Mapped[date] = mapped_column(
        Date, nullable=False, comment="報酬対象期間"
    )
    reward_type: Mapped[str] = mapped_column(
        String(30), nullable=False, comment="報酬種別"
    )
    
    # 金額情報
    gross_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), nullable=False, comment="総支給額"
    )
    tax_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=0, comment="税額"
    )
    net_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), nullable=False, comment="手取り額"
    )
    
    # 最低支払額チェック
    minimum_payout: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=5000, comment="最低支払額"
    )
    is_payout_eligible: Mapped[bool] = mapped_column(
        Boolean, default=False, comment="支払対象フラグ"
    )
    
    # ステータス
    status: Mapped[str] = mapped_column(
        String(20), default=RewardStatus.CALCULATED.value, comment="報酬ステータス"
    )
    
    # 繰越情報
    carried_over_from_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("rewards.id"), comment="繰越元報酬ID"
    )
    carried_over_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2), default=0, comment="繰越額"
    )
    
    # 計算詳細
    calculation_details: Mapped[Optional[dict]] = mapped_column(
        JSON, comment="計算詳細データ"
    )
    
    # 支払情報
    payment_scheduled_date: Mapped[Optional[date]] = mapped_column(
        Date, comment="支払予定日"
    )
    payment_executed_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), comment="支払実行日時"
    )
    
    # GMO NetBank連携情報
    gmo_transfer_id: Mapped[Optional[str]] = mapped_column(
        String(100), comment="GMO振込ID"
    )
    gmo_batch_id: Mapped[Optional[str]] = mapped_column(
        String(100), comment="GMOバッチID"
    )
    
    # 備考
    notes: Mapped[Optional[str]] = mapped_column(
        Text, comment="備考"
    )
    
    # リレーション
    member = relationship("Member", back_populates="rewards")
    calculation = relationship("RewardCalculation", back_populates="reward", uselist=False)
    carried_over_from = relationship("Reward", remote_side=[id])
    
    @property
    def effective_amount(self) -> Decimal:
        """実効支払額（繰越含む）"""
        return self.net_amount + self.carried_over_amount
    
    def __repr__(self) -> str:
        return f"<Reward(id={self.id}, member_id={self.member_id}, period={self.reward_period}, amount={self.net_amount})>"


class RewardCalculation(Base):
    """報酬計算詳細テーブル"""
    __tablename__ = "reward_calculations"
    
    # 基本情報
    id: Mapped[int] = mapped_column(Integer, primary_key=True, comment="計算ID")
    reward_id: Mapped[int] = mapped_column(
        ForeignKey("rewards.id"), nullable=False, unique=True, comment="報酬ID"
    )
    
    # 計算期間
    calculation_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, comment="計算実行日時"
    )
    target_period_from: Mapped[date] = mapped_column(
        Date, nullable=False, comment="計算対象期間（開始）"
    )
    target_period_to: Mapped[date] = mapped_column(
        Date, nullable=False, comment="計算対象期間（終了）"
    )
    
    # 計算基礎データ
    base_sales: Mapped[Decimal] = mapped_column(
        Numeric(15, 2), default=0, comment="基準売上"
    )
    left_leg_sales: Mapped[Decimal] = mapped_column(
        Numeric(15, 2), default=0, comment="左脚売上"
    )
    right_leg_sales: Mapped[Decimal] = mapped_column(
        Numeric(15, 2), default=0, comment="右脚売上"
    )
    
    # 計算パラメータ
    bonus_rate: Mapped[Decimal] = mapped_column(
        Numeric(5, 4), default=0.1, comment="ボーナス率"
    )
    max_payout_rate: Mapped[Optional[Decimal]] = mapped_column(
        Numeric(5, 4), comment="最大支払率"
    )
    
    # 計算結果詳細
    calculation_steps: Mapped[Optional[dict]] = mapped_column(
        JSON, comment="計算ステップ詳細"
    )
    
    # バリデーション
    is_validated: Mapped[bool] = mapped_column(
        Boolean, default=False, comment="バリデーション済みフラグ"
    )
    validation_notes: Mapped[Optional[str]] = mapped_column(
        Text, comment="バリデーション備考"
    )
    
    # リレーション
    reward = relationship("Reward", back_populates="calculation")
    
    def __repr__(self) -> str:
        return f"<RewardCalculation(id={self.id}, reward_id={self.reward_id}, amount={self.reward.net_amount if self.reward else 'N/A'})>"