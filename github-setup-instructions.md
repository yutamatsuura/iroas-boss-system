# GitHub認証設定手順

## 🔐 Personal Access Token を作成

GitHubにプッシュするために認証トークンが必要です。

### Step 1: Personal Access Token 作成

1. **GitHubにログイン**後、右上のプロフィール写真をクリック
2. **「Settings」**を選択
3. 左側メニューの**「Developer settings」**をクリック
4. **「Personal access tokens」** → **「Tokens (classic)」**をクリック
5. **「Generate new token」** → **「Generate new token (classic)」**をクリック

### Step 2: トークン設定

**必要な設定：**
- **Note**: `IROAS BOSS System Development`
- **Expiration**: `90 days` (推奨)
- **Select scopes**: 以下にチェック ✅
  - ✅ **repo** (Full control of private repositories)
    - ✅ repo:status
    - ✅ repo_deployment  
    - ✅ public_repo
    - ✅ repo:invite
    - ✅ security_events
  - ✅ **workflow** (Update GitHub Action workflows)

### Step 3: トークン生成・保存

1. **「Generate token」**をクリック
2. **表示されるトークンをコピー** (重要：再表示されません！)
3. 安全な場所に保存

### Step 4: GitHubにプッシュ

トークンを作成したら、以下のコマンドを実行してください：

```bash
cd /home/matsuura/Desktop/BOSS-system-new
git push -u origin main
```

**Username**: `yutamatsuura`  
**Password**: `作成したPersonal Access Token`

## 🔄 今後の自動化

初回設定後は、以下のコマンドで簡単にプッシュできます：

```bash
# 変更をステージング
git add .

# コミット
git commit -m "Update: 変更内容の説明"

# プッシュ  
git push
```

## 🚨 セキュリティ注意

- Personal Access Token は**絶対に他人に見せない**
- トークンが漏洩した場合は**即座に削除・再生成**
- 定期的にトークンを更新（90日毎）

---

**トークン作成完了後、プッシュを実行してください！**