"""
IROAS BOSS System - Payment Models
決済関連テーブル (Univapay, GMO NetBank対応)
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, Boolean, Text, Numeric, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from enum import Enum as PyEnum
from decimal import Decimal

from .base import Base


class PaymentStatus(PyEnum):
    """決済ステータス"""
    PENDING = "pending"        # 処理中
    COMPLETED = "completed"    # 完了
    FAILED = "failed"          # 失敗
    CANCELLED = "cancelled"    # キャンセル
    REFUNDED = "refunded"      # 返金


class PaymentMethod(PyEnum):
    """決済方法"""
    CREDIT_CARD = "credit_card"    # クレジットカード
    BANK_TRANSFER = "bank_transfer" # 銀行振込
    CONVENIENCE = "convenience"     # コンビニ決済


class Payment(Base):
    """決済テーブル"""
    __tablename__ = "payments"
    
    # 基本情報
    id: Mapped[int] = mapped_column(Integer, primary_key=True, comment="決済ID")
    member_id: Mapped[int] = mapped_column(
        ForeignKey("members.id"), nullable=False, comment="会員ID"
    )
    
    # 決済情報
    amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, comment="決済金額"
    )
    currency: Mapped[str] = mapped_column(
        String(3), default="JPY", comment="通貨コード"
    )
    payment_method: Mapped[str] = mapped_column(
        String(20), nullable=False, comment="決済方法"
    )
    status: Mapped[str] = mapped_column(
        String(20), default=PaymentStatus.PENDING.value, comment="決済ステータス"
    )
    
    # Univapay連携情報
    univapay_charge_id: Mapped[Optional[str]] = mapped_column(
        String(100), unique=True, comment="Univapay チャージID"
    )
    univapay_token: Mapped[Optional[str]] = mapped_column(
        String(100), comment="Univapay トークン"
    )
    
    # 決済詳細
    description: Mapped[Optional[str]] = mapped_column(
        String(500), comment="決済説明"
    )
    reference_number: Mapped[Optional[str]] = mapped_column(
        String(50), comment="参照番号"
    )
    
    # 日時情報
    payment_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), comment="決済実行日時"
    )
    due_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), comment="支払期限"
    )
    
    # エラー情報
    error_code: Mapped[Optional[str]] = mapped_column(
        String(50), comment="エラーコード"
    )
    error_message: Mapped[Optional[str]] = mapped_column(
        Text, comment="エラーメッセージ"
    )
    
    # 追加データ（JSON形式）
    metadata: Mapped[Optional[dict]] = mapped_column(
        JSON, comment="メタデータ"
    )
    
    # リレーション
    member = relationship("Member", back_populates="payments")
    payment_results = relationship("PaymentResult", back_populates="payment")
    
    def __repr__(self) -> str:
        return f"<Payment(id={self.id}, member_id={self.member_id}, amount={self.amount}, status={self.status})>"


class PaymentResult(Base):
    """決済結果テーブル（CSV出力用）"""
    __tablename__ = "payment_results"
    
    # 基本情報
    id: Mapped[int] = mapped_column(Integer, primary_key=True, comment="結果ID")
    payment_id: Mapped[int] = mapped_column(
        ForeignKey("payments.id"), nullable=False, comment="決済ID"
    )
    
    # 処理情報
    process_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, comment="処理日時"
    )
    process_type: Mapped[str] = mapped_column(
        String(20), nullable=False, comment="処理種別"
    )
    
    # 結果情報
    result_status: Mapped[str] = mapped_column(
        String(20), nullable=False, comment="結果ステータス"
    )
    result_amount: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False, comment="処理金額"
    )
    
    # CSV出力情報
    csv_exported: Mapped[bool] = mapped_column(
        Boolean, default=False, comment="CSV出力済みフラグ"
    )
    csv_export_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), comment="CSV出力日時"
    )
    csv_filename: Mapped[Optional[str]] = mapped_column(
        String(200), comment="CSV出力ファイル名"
    )
    
    # 外部システム情報
    external_transaction_id: Mapped[Optional[str]] = mapped_column(
        String(100), comment="外部システム取引ID"
    )
    
    # 備考
    notes: Mapped[Optional[str]] = mapped_column(
        Text, comment="備考"
    )
    
    # リレーション
    payment = relationship("Payment", back_populates="payment_results")
    
    def __repr__(self) -> str:
        return f"<PaymentResult(id={self.id}, payment_id={self.payment_id}, status={self.result_status})>"