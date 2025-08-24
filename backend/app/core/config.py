"""
IROAS BOSS System - Configuration Settings
アプリケーション設定管理
"""

from typing import List, Optional
from pydantic import BaseSettings, validator
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Project info
    PROJECT_NAME: str = "IROAS BOSS System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    JWT_SECRET_KEY: str = "dev-jwt-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str = "postgresql://boss_user:boss_password@localhost:5432/boss_local"
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173", 
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]
    
    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str):
            return [i.strip() for i in v.split(",")]
        return v
    
    # Frontend URL
    FRONTEND_URL: str = "http://localhost:3000"
    
    # File uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 10485760  # 10MB
    
    # MLM System settings
    MINIMUM_PAYOUT_AMOUNT: int = 5000
    PAYOUT_DAY: int = 5
    TRANSFER_DEADLINE_DAY: int = 12
    BINARY_BONUS_RATE: float = 0.1
    UNILEVEL_BONUS_RATE: float = 0.05
    
    # Email settings
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    
    # External APIs
    UNIVAPAY_API_URL: str = "https://api.test.univapay.com"
    UNIVAPAY_APP_ID: Optional[str] = None
    UNIVAPAY_SECRET_KEY: Optional[str] = None
    UNIVAPAY_WEBHOOK_SECRET: Optional[str] = None
    
    GMO_BANK_API_URL: str = "https://test.api.gmo-bank.com"
    GMO_BANK_CLIENT_ID: Optional[str] = None
    GMO_BANK_CLIENT_SECRET: Optional[str] = None
    
    # Logging
    LOG_LEVEL: str = "DEBUG"
    LOG_FILE_PATH: str = "./logs/app.log"
    
    class Config:
        env_file = ".env.local"
        case_sensitive = True


settings = Settings()