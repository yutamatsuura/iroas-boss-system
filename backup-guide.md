# 🔒 BOSS Systemデータ保全ガイド

## ❗ 重要：仮想環境のリスク
WSL（Linux仮想環境）で作業中のファイルは、環境を削除すると**完全に失われます**。
複数の保全策を実施することを強く推奨します。

## 🚀 推奨方法（優先順）

### 1. **GitHubリポジトリ作成** （最も安全・推奨）

**手順：**
1. [GitHub](https://github.com/)にアクセスしてログイン
2. 「New repository」をクリック
3. Repository name: `iroas-boss-system`
4. **必ずPrivateに設定**（機密情報のため）
5. 「Create repository」をクリック

**WSLでの設定：**
```bash
cd /home/matsuura/Desktop/BOSS-system-new

# Git設定（初回のみ）
git config user.name "あなたの名前"
git config user.email "your-email@example.com"

# リモートリポジトリ追加
git remote add origin https://github.com/[あなたのユーザー名]/iroas-boss-system.git

# プッシュ
git push -u origin main
```

**メリット：**
- ✅ 完全自動バックアップ
- ✅ 変更履歴管理
- ✅ どこからでもアクセス可能
- ✅ チーム開発対応

### 2. **Windowsフォルダへの定期コピー**

```bash
# コピースクリプト作成
cat > backup-to-windows.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/mnt/c/Users/Public/BOSS-backup-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
cp -r /home/matsuura/Desktop/BOSS-system-new/* "$BACKUP_DIR/" 2>/dev/null
echo "Backup completed to: $BACKUP_DIR"
EOF

chmod +x backup-to-windows.sh

# 実行
./backup-to-windows.sh
```

### 3. **ZIP圧縮バックアップ**

```bash
# 日付付きZIPバックアップ作成
cd /home/matsuura/Desktop
zip -r "BOSS-backup-$(date +%Y%m%d-%H%M).zip" BOSS-system-new/ -x "BOSS-system-new/.git/*"

# WindowsのDownloadsフォルダにコピー
cp BOSS-backup-*.zip /mnt/c/Users/Public/Downloads/
```

## 🔧 復旧手順

### GitHubから復旧
```bash
# 新しい場所にクローン
cd /home/matsuura/Desktop
git clone https://github.com/[ユーザー名]/iroas-boss-system.git BOSS-system-recovered
cd BOSS-system-recovered
```

### Windowsフォルダから復旧
```bash
# WSLから実行
cp -r /mnt/c/Users/Public/BOSS-backup-YYYYMMDD /home/matsuura/Desktop/BOSS-system-recovered
```

### ZIPから復旧
```bash
cd /home/matsuura/Desktop
unzip /mnt/c/Users/Public/Downloads/BOSS-backup-YYYYMMDD-HHMM.zip
```

## 🔄 自動バックアップ設定

### 定期バックアップスクリプト
```bash
# crontabに追加（1日1回バックアップ）
crontab -e

# 以下を追加
0 2 * * * cd /home/matsuura/Desktop/BOSS-system-new && git add . && git commit -m "Auto backup $(date)" && git push
```

## ⚠️ セキュリティ注意点

1. **プライベートリポジトリ必須**
   - 機密情報（API キー、データベース情報）が含まれるため

2. **環境変数ファイル管理**
   - `.env.production`は特に注意深く管理
   - 可能であれば別途暗号化保存

3. **アクセス制限**
   - GitHubリポジトリは最小限の人数のみアクセス許可

## 📋 チェックリスト

- [ ] GitHubアカウント作成・ログイン確認
- [ ] プライベートリポジトリ作成
- [ ] ローカルGit設定完了
- [ ] 初回プッシュ成功
- [ ] Windows フォルダバックアップ作成
- [ ] 復旧テスト実施（推奨）

---
**緊急連絡先：** プロジェクトに関する技術的問題が発生した場合の連絡先を記載