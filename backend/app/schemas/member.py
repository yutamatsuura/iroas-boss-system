"""
IROAS BOSS System - Member Schemas
会員管理用Pydanticスキーマ (P-002対応)
"""

from typing import Optional, List
from datetime import datetime, date
from pydantic import BaseModel, EmailStr, Field, validator
from decimal import Decimal


class MemberBase(BaseModel):
    """会員基本情報"""
    family_name: str = Field(..., min_length=1, max_length=50)
    given_name: str = Field(..., min_length=1, max_length=50)
    family_name_kana: Optional[str] = Field(None, max_length=100)
    given_name_kana: Optional[str] = Field(None, max_length=100)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=15)
    postal_code: Optional[str] = Field(None, max_length=8)
    prefecture: Optional[str] = Field(None, max_length=10)
    city: Optional[str] = Field(None, max_length=50)
    address_line: Optional[str] = Field(None, max_length=200)


class MemberCreate(MemberBase):
    """会員作成"""
    member_code: str = Field(..., min_length=3, max_length=20)
    sponsor_id: Optional[int] = None
    upline_id: Optional[int] = None
    binary_position: Optional[str] = Field(None, regex=r'^[LR]$')
    
    # 銀行口座情報（オプション）
    bank_name: Optional[str] = Field(None, max_length=50)
    branch_name: Optional[str] = Field(None, max_length=50)
    account_type: Optional[str] = Field(None, regex=r'^(普通|当座)$')
    account_number: Optional[str] = Field(None, max_length=20)
    account_holder: Optional[str] = Field(None, max_length=100)


class MemberUpdate(BaseModel):
    """会員更新"""
    family_name: Optional[str] = Field(None, min_length=1, max_length=50)
    given_name: Optional[str] = Field(None, min_length=1, max_length=50)
    family_name_kana: Optional[str] = Field(None, max_length=100)
    given_name_kana: Optional[str] = Field(None, max_length=100)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=15)
    postal_code: Optional[str] = Field(None, max_length=8)
    prefecture: Optional[str] = Field(None, max_length=10)
    city: Optional[str] = Field(None, max_length=50)
    address_line: Optional[str] = Field(None, max_length=200)
    
    # ステータス更新
    status: Optional[str] = Field(None, regex=r'^(active|suspended|withdrawn|pending)$')
    
    # 銀行口座情報
    bank_name: Optional[str] = Field(None, max_length=50)
    branch_name: Optional[str] = Field(None, max_length=50)
    account_type: Optional[str] = Field(None, regex=r'^(普通|当座)$')
    account_number: Optional[str] = Field(None, max_length=20)
    account_holder: Optional[str] = Field(None, max_length=100)
    
    # 備考
    notes: Optional[str] = None


class MemberSponsor(BaseModel):
    """スポンサー情報（簡略版）"""
    id: int
    member_code: str
    full_name: str


class Member(MemberBase):
    """会員情報（レスポンス用）"""
    id: int
    member_code: str
    status: str
    is_active: bool
    organization_level: int
    binary_position: Optional[str]
    
    # 日付情報
    registration_date: datetime
    activation_date: Optional[datetime]
    suspension_date: Optional[datetime]
    withdrawal_date: Optional[datetime]
    
    # 累計情報
    total_sales: Optional[Decimal] = Field(default=0)
    total_rewards: Optional[Decimal] = Field(default=0)
    
    # 銀行口座情報
    bank_name: Optional[str]
    branch_name: Optional[str] 
    account_type: Optional[str]
    account_number: Optional[str]
    account_holder: Optional[str]
    
    # 組織情報
    sponsor: Optional[MemberSponsor] = None
    
    # タイムスタンプ
    created_at: datetime
    updated_at: Optional[datetime]
    
    @property
    def full_name(self) -> str:
        return f"{self.family_name} {self.given_name}"
    
    @property
    def full_name_kana(self) -> Optional[str]:
        if self.family_name_kana and self.given_name_kana:
            return f"{self.family_name_kana} {self.given_name_kana}"
        return None

    class Config:
        from_attributes = True


class MemberInDB(Member):
    """データベース用会員情報"""
    sponsor_id: Optional[int]
    upline_id: Optional[int]
    notes: Optional[str]


class MemberList(BaseModel):
    """会員一覧"""
    members: List[Member]
    total: int
    page: int
    size: int


class MemberStats(BaseModel):
    """会員統計"""
    total_members: int
    active_members: int
    suspended_members: int
    withdrawn_members: int
    pending_members: int
    new_registrations_this_month: int