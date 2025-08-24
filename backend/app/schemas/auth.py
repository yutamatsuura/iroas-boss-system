"""
IROAS BOSS System - Authentication Schemas
認証用Pydanticスキーマ
"""

from typing import Optional
from pydantic import BaseModel, EmailStr


class UserLogin(BaseModel):
    """ログイン"""
    email: EmailStr
    password: str


class UserRegister(BaseModel):
    """ユーザー登録"""
    email: EmailStr
    password: str
    full_name: str
    role: str = "admin"


class Token(BaseModel):
    """トークン"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class TokenData(BaseModel):
    """トークンデータ"""
    email: Optional[str] = None


class User(BaseModel):
    """ユーザー情報"""
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True