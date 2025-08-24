#!/bin/bash
# IROAS BOSS System - 自動バックアップスクリプト
# 開発中の定期バックアップ用

PROJECT_DIR="/home/matsuura/Desktop/BOSS-system-new"
WINDOWS_BACKUP_DIR="/mnt/c/Users/Public/BOSS-system-backup"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

echo "🔄 Starting backup process at $TIMESTAMP"

# Change to project directory
cd "$PROJECT_DIR"

# Stage all changes
echo "📝 Staging all changes..."
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
    echo "ℹ️ No changes to commit"
else
    # Commit changes with timestamp
    echo "💾 Committing changes..."
    git commit -m "Auto backup: Development progress at $TIMESTAMP

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push
    
    if [ $? -eq 0 ]; then
        echo "✅ GitHub backup successful"
    else
        echo "❌ GitHub backup failed"
        exit 1
    fi
fi

# Update Windows backup (excluding .git directory for performance)
echo "💾 Updating Windows backup..."
rsync -av --exclude='.git' --exclude='node_modules' --exclude='__pycache__' "$PROJECT_DIR/" "$WINDOWS_BACKUP_DIR/" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Windows backup successful"
else
    echo "⚠️ Windows backup had some issues (likely permission warnings - files were copied)"
fi

echo "🎉 Backup process completed at $(date +"%Y-%m-%d %H:%M:%S")"
echo "📍 GitHub: https://github.com/yutamatsuura/iroas-boss-system"
echo "📍 Windows: C:\Users\Public\BOSS-system-backup\"
echo ""