# IROAS BOSS System - 環境セットアップガイド

このガイドでは、IROAS BOSS Systemの開発環境から本番環境までのセットアップ手順を説明します。

## 📋 事前準備

### 1. Gitユーザー設定

```bash
# Gitの初回設定（まだ設定していない場合）
git config --global user.name "あなたの名前"
git config --global user.email "your-email@example.com"

# または、このリポジトリのみの設定
cd /home/matsuura/Desktop/BOSS-system-new
git config user.name "あなたの名前"  
git config user.email "your-email@example.com"
```

### 2. 必要なソフトウェア

- **Git**: バージョン管理
- **Node.js 18+**: フロントエンド開発
- **Python 3.11+**: バックエンド開発
- **Docker & Docker Compose**: 開発環境（推奨）

## 🔧 環境別セットアップ

### 開発環境（Local）

1. **環境変数設定**
   ```bash
   # 既に.env.localファイルが作成済みです
   # 必要に応じて値を調整してください
   nano .env.local
   ```

2. **データベース準備**
   ```bash
   # DockerでPostgreSQLとRedisを起動
   docker-compose up -d postgres redis
   ```

3. **開発サーバー起動**
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload

   # Frontend  
   cd frontend
   npm install
   npm run dev
   ```

### ステージング環境

1. **NEON PostgreSQL設定**
   - [NEON](https://neon.tech/)でステージング用データベース作成
   - `.env.staging`の[STAGING_DB_*]部分を実際の値に置換

2. **Univapay・GMO NetBank設定**
   - テスト環境の認証情報を`.env.staging`に設定

3. **デプロイ**
   ```bash
   # ステージング環境へデプロイ
   ./scripts/deploy-staging.sh
   ```

### 本番環境

1. **データベース・インフラ準備**
   - NEON PostgreSQLで本番用データベース作成
   - Redisクラウドサービスの設定
   - SSL証明書の取得

2. **環境変数設定**
   ```bash
   # .env.productionの全ての[PRODUCTION_*]を実際の値に置換
   # 特に以下は必ず変更：
   # - SECRET_KEY (32文字以上のランダム文字列)
   # - JWT_SECRET_KEY (32文字以上のランダム文字列)  
   # - DATABASE_URL (本番データベース接続情報)
   # - UNIVAPAY_* (本番API認証情報)
   # - GMO_BANK_* (本番API認証情報)
   ```

3. **セキュリティ設定**
   - HTTPS必須
   - ファイアウォール設定
   - セキュリティヘッダー有効化
   - 定期バックアップの設定

## 🌐 GitHub連携

### リポジトリ作成手順

1. **GitHubアカウント確認**
   - GitHubアカウントをお持ちでない場合は作成してください
   - [GitHub](https://github.com/)にアクセス

2. **新しいリポジトリ作成**
   ```bash
   # GitHub CLIを使用する場合
   gh repo create iroas-boss-system --private --description "IROAS MLM Management System"
   
   # または、GitHubのWebサイトで手動作成
   # Repository name: iroas-boss-system
   # Privacy: Private（重要：機密情報のため）
   ```

3. **リモートリポジトリ追加**
   ```bash
   cd /home/matsuura/Desktop/BOSS-system-new
   git remote add origin https://github.com/[YOUR_USERNAME]/iroas-boss-system.git
   git push -u origin main
   ```

### ブランチ戦略

```
main
├── develop
├── feature/user-management
├── feature/payment-integration
└── hotfix/security-patch
```

- **main**: 本番環境用
- **develop**: 開発統合用
- **feature/***: 機能開発用
- **hotfix/***: 緊急修正用

## 🔐 セキュリティチェックリスト

### 開発環境
- [ ] .env.localは開発用の値のみ使用
- [ ] 本番認証情報は含めない
- [ ] ローカルでHTTPS設定（推奨）

### ステージング環境  
- [ ] テスト用API認証情報を使用
- [ ] 本番データは使用しない
- [ ] 基本認証またはIP制限で保護

### 本番環境
- [ ] 全ての認証情報を本番用に変更
- [ ] HTTPS必須設定
- [ ] セキュリティヘッダー有効化
- [ ] 定期バックアップ設定
- [ ] 監視・アラート設定
- [ ] ログ収集設定

## 🚨 注意事項

1. **機密情報の取り扱い**
   - `.env.production`は絶対にGitにコミットしない
   - 本番認証情報は安全に管理する
   - 定期的にAPIキーをローテーションする

2. **データベースアクセス**
   - 本番データベースへの直接アクセスは制限
   - バックアップから復旧テストを定期実行
   - マイグレーション前は必ずバックアップを取得

3. **デプロイ**
   - ステージング環境での十分なテスト
   - 本番デプロイ前のチェックリスト確認
   - ロールバック手順の準備

## 📞 トラブルシューティング

### よくある問題

1. **Git認証エラー**
   ```bash
   # SSH鍵の設定または個人アクセストークンを使用
   git remote set-url origin https://[TOKEN]@github.com/[USERNAME]/iroas-boss-system.git
   ```

2. **データベース接続エラー**
   ```bash
   # 接続情報とネットワーク設定を確認
   # NEONダッシュボードで接続詳細を確認
   ```

3. **環境変数読み込みエラー**
   ```bash
   # ファイル権限と文字コードを確認
   chmod 600 .env.*
   ```

次のステップでは、実際の開発環境構築（Docker設定、データベース設計、API実装）に進みます。