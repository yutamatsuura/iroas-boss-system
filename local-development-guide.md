# 🖥️ ローカル開発環境セットアップガイド

DockerなしでIROAS BOSS Systemを開発するための手順

## 📋 前提条件

### 必要なソフトウェア
- **Node.js 18+** (フロントエンド用)
- **Python 3.11+** (バックエンド用)  
- **PostgreSQL 15+** (データベース)
- **Redis 6+** (キャッシュ) - オプション

## 🔧 セットアップ手順

### 1. Node.js インストール確認
```bash
node --version  # v18以上必要
npm --version   # v9以上推奨
```

### 2. Python環境準備
```bash
python3 --version  # 3.11以上必要
pip --version
```

### 3. データベース準備

#### Option A: NEONクラウドDB（推奨）
1. [NEON](https://neon.tech/)でPostgreSQLデータベース作成
2. 接続URLを`.env.local`に設定

#### Option B: ローカルPostgreSQL
```bash
# Ubuntu/WSL
sudo apt update
sudo apt install postgresql postgresql-contrib

# データベース作成
sudo -u postgres createdb boss_local
sudo -u postgres createuser boss_user
sudo -u postgres psql -c "ALTER USER boss_user WITH PASSWORD 'boss_password';"
```

### 4. フロントエンド起動
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000 で起動
```

### 5. バックエンド起動
```bash
cd backend
pip install -r requirements.txt

# データベースマイグレーション
alembic upgrade head

# サーバー起動
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# → http://localhost:8000 で起動
```

## 🔗 アクセスURL

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:8000
- **API ドキュメント**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 トラブルシューティング

### Node.js関連
```bash
# Node.jsバージョンエラー
npm install -g n
n latest

# 権限エラー
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

### Python関連
```bash
# 仮想環境作成（推奨）
python3 -m venv boss_env
source boss_env/bin/activate
pip install -r requirements.txt
```

### データベース接続エラー
```bash
# 接続確認
psql -h localhost -U boss_user -d boss_local

# .env.localの設定確認
DATABASE_URL=postgresql://boss_user:boss_password@localhost:5432/boss_local
```

## 🔄 開発ワークフロー

### 1. 両方のサーバーを同時起動
```bash
# Terminal 1 (Backend)
cd backend && uvicorn main:app --reload

# Terminal 2 (Frontend) 
cd frontend && npm run dev
```

### 2. 変更時の自動リロード
- フロントエンド: Viteが自動でホットリロード
- バックエンド: `--reload`オプションで自動再起動

### 3. API開発
1. `backend/app/api/api_v1/endpoints/`に新しいエンドポイント追加
2. `http://localhost:8000/docs`でSwaggerUI確認
3. フロントエンドから`http://localhost:8000/api/v1/`でアクセス

## 📊 データベース管理

### Alembic (マイグレーション)
```bash
cd backend

# マイグレーション作成
alembic revision --autogenerate -m "Add new table"

# マイグレーション適用
alembic upgrade head

# 履歴確認
alembic history
```

## 🚀 本番環境への準備

### ビルド確認
```bash
# フロントエンド
cd frontend && npm run build

# バックエンド
cd backend && python -m pytest
```

---

このガイドでローカル開発環境が構築できます。
Docker環境は後で導入することも可能です。