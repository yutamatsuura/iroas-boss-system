-- IROAS BOSS System - Database Extensions
-- PostgreSQL拡張機能の有効化

-- UUID生成用
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 暗号化機能
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 全文検索機能（日本語対応）
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- JSON操作機能拡張
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- タイムゾーン機能
SET timezone = 'Asia/Tokyo';

-- デフォルトロール作成
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'boss_admin') THEN
        CREATE ROLE boss_admin;
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'boss_readonly') THEN
        CREATE ROLE boss_readonly;
    END IF;
END
$$;