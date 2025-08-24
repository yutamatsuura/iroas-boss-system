# IROAS BOSS System

IROAS MLM管理システム - 会員管理、決済処理、報酬計算を統合管理

## 🚀 概要

IROAS BOSS Systemは、MLM（Multi-Level Marketing）事業の管理を効率化するWebアプリケーションです。
既存のBOSSシステムから移行し、現代的な技術スタックで再構築されています。

### 主な機能

- **会員管理**: 45名のMLM会員情報の管理
- **組織図表示**: バイナリーツリー構造での組織階層表示
- **決済処理**: Univapay連携による自動決済管理
- **報酬計算**: 精密なMLM報酬計算システム
- **銀行振込**: GMO NetBank連携による報酬支払い
- **データ管理**: CSV形式での既存データ移行対応

## 🛠 技術スタック

### Backend
- **Python 3.11+**
- **FastAPI**: 高性能API フレームワーク
- **SQLAlchemy 2.0**: ORM
- **PostgreSQL 15+**: メインデータベース
- **Redis**: キャッシュ・セッション管理
- **Uvicorn**: ASGI サーバー

### Frontend
- **React 18**: UIライブラリ
- **TypeScript 5**: 型安全性
- **Vite 5**: 高速ビルドツール
- **React Router**: ルーティング
- **TanStack Query**: データフェッチング
- **Tailwind CSS**: スタイリング

### 外部サービス
- **Univapay**: 決済処理
- **GMO NetBank**: 銀行振込
- **NEON**: PostgreSQL クラウドホスティング

## 📋 環境要件

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+
- Redis 6+
- Docker & Docker Compose（開発環境）

## 🔧 セットアップ

### 1. 環境変数の設定

```bash
# 環境変数ファイルをコピー
cp .env.example .env.local

# 必要な値を設定
nano .env.local
```

### 2. データベース準備

```bash
# PostgreSQLの起動（Dockerを使用する場合）
docker-compose up -d postgres redis

# マイグレーション実行
cd backend
alembic upgrade head
```

### 3. 依存関係のインストール

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 4. 開発サーバー起動

```bash
# Backend（ポート8000）
cd backend
uvicorn main:app --reload

# Frontend（ポート5173）
cd frontend
npm run dev
```

## 📁 プロジェクト構造

```
BOSS-system-new/
├── backend/                 # FastAPI バックエンド
│   ├── app/
│   │   ├── api/            # API エンドポイント
│   │   ├── models/         # SQLAlchemy モデル
│   │   ├── schemas/        # Pydantic スキーマ
│   │   ├── services/       # ビジネスロジック
│   │   └── utils/          # ユーティリティ
│   ├── alembic/            # データベースマイグレーション
│   └── requirements.txt    # Python依存関係
├── frontend/               # React フロントエンド
│   ├── src/
│   │   ├── components/     # Reactコンポーネント
│   │   ├── pages/          # ページコンポーネント
│   │   ├── hooks/          # カスタムフック
│   │   ├── services/       # API クライアント
│   │   └── types/          # TypeScript型定義
│   ├── public/             # 静的ファイル
│   └── package.json        # Node.js依存関係
├── docs/                   # ドキュメント
├── mockups/               # HTML モックアップ
└── docker-compose.yml     # Docker設定
```

## 🔒 セキュリティ

- JWT認証による安全なAPI アクセス
- HTTPS必須（本番環境）
- SQLインジェクション対策
- XSS対策
- CSRF保護
- セキュアヘッダーの設定

## 📊 モニタリング

- ヘルスチェックエンドポイント: `/health`
- メトリクス収集: `/metrics`
- ログ収集: JSON形式でファイル出力
- エラー監視: Sentry連携

## 🧪 テスト

```bash
# Backend テスト
cd backend
pytest

# Frontend テスト
cd frontend
npm run test
```

## 🚀 デプロイ

### ステージング環境
```bash
# ステージング環境へデプロイ
./scripts/deploy-staging.sh
```

### 本番環境
```bash
# 本番環境へデプロイ
./scripts/deploy-production.sh
```

## 📝 API ドキュメント

開発サーバー起動後、以下のURLでAPI ドキュメントを確認できます：

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 開発ガイドライン

- コードレビューは必須
- テストカバレッジ80%以上を維持
- TypeScript strictモードを使用
- ESLint・Prettierによるコード整形
- コミットメッセージはConventional Commits形式

## 📞 サポート

技術的な問題や質問がある場合：

1. まず[ドキュメント](./docs/)を確認
2. [Issues](../../issues)で既存の問題を検索
3. 新しいIssueを作成

## 📄 ライセンス

このプロジェクトは私有システムです。無断転載・配布を禁止します。

---

**IROAS BOSS System** - MLM管理の未来を創る