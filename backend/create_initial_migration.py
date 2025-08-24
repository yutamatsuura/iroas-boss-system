#!/usr/bin/env python3
"""
IROAS BOSS System - Create Initial Migration
初回マイグレーション作成スクリプト
"""

import subprocess
import sys
import os

def run_command(command: str) -> bool:
    """コマンド実行"""
    try:
        result = subprocess.run(
            command.split(), 
            capture_output=True, 
            text=True,
            cwd=os.path.dirname(__file__)
        )
        
        if result.returncode == 0:
            print(f"✅ {command}")
            if result.stdout:
                print(f"   {result.stdout.strip()}")
            return True
        else:
            print(f"❌ {command}")
            if result.stderr:
                print(f"   Error: {result.stderr.strip()}")
            return False
            
    except Exception as e:
        print(f"❌ {command} - Exception: {e}")
        return False

def main():
    """メイン処理"""
    print("🚀 IROAS BOSS System - Initial Migration Creation")
    print("=" * 50)
    
    # 1. Alembic初期化確認
    if not os.path.exists("alembic/versions"):
        print("📁 Creating alembic versions directory...")
        os.makedirs("alembic/versions", exist_ok=True)
    
    # 2. 初期マイグレーション作成
    print("📝 Creating initial migration...")
    success = run_command("alembic revision --autogenerate -m 'Initial migration: MLM system tables'")
    
    if success:
        print("\n🎉 Initial migration created successfully!")
        print("\n📋 Next steps:")
        print("   1. Review the generated migration file in alembic/versions/")
        print("   2. Run: alembic upgrade head")
        print("   3. Verify tables created in your database")
    else:
        print("\n💥 Migration creation failed!")
        print("   Please check your database connection and model imports")
        sys.exit(1)

if __name__ == "__main__":
    main()