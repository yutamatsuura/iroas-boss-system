# デザインシステム定義書

## 基本情報
- プロジェクト名: IROAS BOSS-system Web版
- テーマ名: Modern Corporate
- 作成日: 2025-08-24
- バージョン: 1.0.0

## デザインコンセプト

Modern Corporateテーマは、プロフェッショナルで信頼性の高い企業向けのデザインを提供します。このテーマは業務効率を重視し、大量のデータを扱う管理システムに最適化されています。

ダークサイドバーを採用することで、長時間の作業における視覚的疲労を軽減し、重要な情報が含まれる統計カードやデータ表示エリアに注意を集中できます。明確な階層構造により、複雑な機能を持つシステムでも直感的な操作を実現します。

## カラーパレット

### プライマリカラー
```css
/* メインブランドカラー - アクションボタンやアクティブ状態に使用 */
--primary: #2563eb;
--primary-hover: #1d4ed8;
--primary-light: #dbeafe;
--primary-dark: #1e40af;
```

### セカンダリカラー
```css
/* セカンダリアクション - サブボタンやアクセントに使用 */
--secondary: #64748b;
--secondary-hover: #475569;
--secondary-light: #f1f5f9;
--secondary-dark: #334155;
```

### ニュートラルカラー
```css
/* 背景とテキストの基本色 */
--background-primary: #ffffff;
--background-secondary: #f8fafc;
--background-dark: #0f172a;
--background-sidebar: #1e293b;

--text-primary: #0f172a;
--text-secondary: #64748b;
--text-light: #94a3b8;
--text-inverse: #ffffff;
```

### セマンティックカラー
```css
/* ステータス表示用 */
--success: #10b981;
--success-light: #d1fae5;
--warning: #f59e0b;
--warning-light: #fef3c7;
--error: #ef4444;
--error-light: #fee2e2;
--info: #3b82f6;
--info-light: #dbeafe;
```

## タイポグラフィ

### フォントファミリー
```css
/* プライマリフォント - システム全体で使用 */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

/* コードやデータ表示用 */
--font-mono: 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
```

### フォントサイズ
```css
--font-size-xs: 0.75rem;    /* 12px - 補足テキスト */
--font-size-sm: 0.875rem;   /* 14px - 通常テキスト */
--font-size-base: 1rem;     /* 16px - 基本サイズ */
--font-size-lg: 1.125rem;   /* 18px - 強調テキスト */
--font-size-xl: 1.25rem;    /* 20px - 小見出し */
--font-size-2xl: 1.5rem;    /* 24px - 見出し */
--font-size-3xl: 1.875rem;  /* 30px - 大見出し */
--font-size-4xl: 2.25rem;   /* 36px - タイトル */
```

## スペーシング

```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
--spacing-3xl: 4rem;     /* 64px */
```

## UI要素スタイル

### ボタン
```css
/* プライマリボタン - 主要アクション用 */
.btn-primary {
  background-color: var(--primary);
  color: var(--text-inverse);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

/* セカンダリボタン - 副次アクション用 */
.btn-secondary {
  background-color: var(--background-primary);
  color: var(--text-primary);
  border: 1px solid var(--secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background-color: var(--secondary-light);
  border-color: var(--secondary-hover);
}
```

### カード
```css
/* 統計カード - ダッシュボード用 */
.card-stats {
  background-color: var(--background-primary);
  border-radius: 0.75rem;
  padding: var(--spacing-lg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.card-stats:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

/* データカード - リスト表示用 */
.card-data {
  background-color: var(--background-primary);
  border-radius: 0.5rem;
  padding: var(--spacing-md);
  border: 1px solid #e5e7eb;
  margin-bottom: var(--spacing-md);
}
```

### フォーム要素
```css
/* 入力フィールド */
.form-input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: var(--font-size-sm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* ラベル */
.form-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}
```

### アラート
```css
.alert {
  padding: var(--spacing-md);
  border-radius: 0.5rem;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-sm);
}

.alert-success {
  background-color: var(--success-light);
  color: var(--success);
  border: 1px solid var(--success);
}

.alert-warning {
  background-color: var(--warning-light);
  color: var(--warning);
  border: 1px solid var(--warning);
}

.alert-error {
  background-color: var(--error-light);
  color: var(--error);
  border: 1px solid var(--error);
}
```

### ナビゲーション要素
```css
/* ナビゲーションアイテム */
.nav-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-light);
  text-decoration: none;
  border-radius: 0.375rem;
  margin-bottom: var(--spacing-xs);
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-inverse);
}

.nav-item.active {
  background-color: var(--primary);
  color: var(--text-inverse);
}
```

### サイドバー要素
```css
/* サイドバーメニュー */
.sidebar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-section {
  color: var(--text-light);
  font-size: var(--font-size-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-sm);
  margin-top: var(--spacing-lg);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-light);
  text-decoration: none;
  border-radius: 0.375rem;
  margin: 0 var(--spacing-sm);
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-inverse);
}

.menu-item.active {
  background-color: var(--primary);
  color: var(--text-inverse);
}
```

## レイアウト

### コンテナ
```css
/* メインコンテナ */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* フルワイドコンテナ */
.container-fluid {
  width: 100%;
  padding: 0 var(--spacing-md);
}
```

### グリッドシステム
```css
/* フレックスベースグリッド */
.grid {
  display: flex;
  flex-wrap: wrap;
  margin: calc(var(--spacing-md) * -1);
}

.grid-item {
  flex: 1;
  padding: var(--spacing-md);
  min-width: 250px;
}

.grid-2 { flex: 0 0 50%; }
.grid-3 { flex: 0 0 33.333%; }
.grid-4 { flex: 0 0 25%; }

@media (max-width: 768px) {
  .grid-item,
  .grid-2,
  .grid-3,
  .grid-4 {
    flex: 0 0 100%;
  }
}
```

## ナビゲーション構造

### グローバルナビゲーション
レイアウトパターン: **サイドバー型**（管理画面系システムに最適）

構成要素:
- **プライマリメニュー**: 主要機能（ダッシュボード、受注管理、在庫管理、顧客管理、レポート）
- **セカンダリメニュー**: 補助機能（設定、ツール、インポート/エクスポート）
- **ユーザーメニュー**: アカウント関連（プロフィール、ログアウト）
- **検索機能**: グローバル検索バーをヘッダーに配置

### サイドバー仕様

**展開/折りたたみ**:
- デフォルト状態: デスクトップでは展開、タブレットでは折りたたみ
- モバイル時の挙動: オーバーレイ表示
- アイコン+ラベル表示: 展開時は両方、折りたたみ時はアイコンのみ

**階層構造**:
- 最大階層数: 2階層まで（可読性重視）
- グルーピング戦略: 機能別セクション分け
- アクティブ状態: 現在のページとその親メニューをハイライト

### レスポンシブ戦略

**ブレークポイント**:
- **モバイル (< 768px)**: ボトムナビゲーション + ハンバーガーメニュー
- **タブレット (768px - 1024px)**: 折りたたみサイドバー
- **デスクトップ (> 1024px)**: 展開サイドバー

## アニメーション

```css
/* 基本トランジション */
.transition-base {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ホバーエフェクト */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* フェードイン */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

## アクセシビリティ

```css
/* フォーカス状態の強化 */
.focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* 高コントラストモード対応 */
@media (prefers-contrast: high) {
  :root {
    --text-primary: #000000;
    --text-secondary: #333333;
    --background-primary: #ffffff;
  }
}

/* 動きの軽減設定 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 実装ガイド

### 1. CSS変数の読み込み
```html
<!-- HTMLのheadセクションに配置 -->
<style>
  :root {
    /* カラーパレット */
    --primary: #2563eb;
    --primary-hover: #1d4ed8;
    --background-sidebar: #1e293b;
    --text-inverse: #ffffff;
    
    /* スペーシング */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    
    /* フォント */
    --font-primary: 'Inter', sans-serif;
    --font-size-sm: 0.875rem;
  }
</style>
```

### 2. クラスの使用例
```html
<!-- ボタン例 -->
<button class="btn-primary">メインアクション</button>
<button class="btn-secondary">キャンセル</button>

<!-- フォーム例 -->
<div class="form-group">
  <label class="form-label" for="email">メールアドレス</label>
  <input type="email" id="email" class="form-input" placeholder="example@company.com">
</div>

<!-- アラート例 -->
<div class="alert alert-success">
  データが正常に保存されました。
</div>
```

### 3. ナビゲーション実装例
```html
<!-- ヘッダーナビゲーション -->
<header class="header">
  <div class="container-fluid">
    <div class="header-content">
      <div class="header-brand">IROAS BOSS</div>
      <div class="header-search">
        <input type="search" class="search-input" placeholder="検索...">
      </div>
      <div class="header-user">
        <div class="user-menu">
          <img src="avatar.jpg" alt="ユーザー" class="user-avatar">
          <span>田中太郎</span>
        </div>
      </div>
    </div>
  </div>
</header>

<!-- サイドバーナビゲーション -->
<aside class="sidebar">
  <div class="sidebar-header">
    <h3>BOSS System</h3>
  </div>
  <nav class="sidebar-nav">
    <ul class="sidebar-menu">
      <li class="menu-section">メイン機能</li>
      <li><a href="/dashboard" class="menu-item active">
        <i class="icon-dashboard"></i>
        <span>ダッシュボード</span>
      </a></li>
      <li><a href="/orders" class="menu-item">
        <i class="icon-orders"></i>
        <span>受注管理</span>
      </a></li>
      <li><a href="/inventory" class="menu-item">
        <i class="icon-inventory"></i>
        <span>在庫管理</span>
      </a></li>
      <li><a href="/customers" class="menu-item">
        <i class="icon-customers"></i>
        <span>顧客管理</span>
      </a></li>
      
      <li class="menu-section">レポート</li>
      <li><a href="/reports/sales" class="menu-item">
        <i class="icon-chart"></i>
        <span>売上レポート</span>
      </a></li>
      <li><a href="/reports/inventory" class="menu-item">
        <i class="icon-chart"></i>
        <span>在庫レポート</span>
      </a></li>
      
      <li class="menu-section">設定</li>
      <li><a href="/settings" class="menu-item">
        <i class="icon-settings"></i>
        <span>システム設定</span>
      </a></li>
    </ul>
  </nav>
</aside>

<!-- メインコンテンツエリア -->
<main class="main-content">
  <div class="container-fluid">
    <!-- 統計カード例 -->
    <div class="grid">
      <div class="grid-4">
        <div class="card-stats">
          <h3>今日の売上</h3>
          <p class="stats-value">¥1,234,567</p>
          <p class="stats-change positive">+12.5%</p>
        </div>
      </div>
      <div class="grid-4">
        <div class="card-stats">
          <h3>受注件数</h3>
          <p class="stats-value">89</p>
          <p class="stats-change positive">+5.2%</p>
        </div>
      </div>
      <div class="grid-4">
        <div class="card-stats">
          <h3>在庫アラート</h3>
          <p class="stats-value">12</p>
          <p class="stats-change negative">要確認</p>
        </div>
      </div>
    </div>
  </div>
</main>
```

## 更新履歴

- v1.0.0 (2025-08-24): 初期デザインシステム作成
  - Modern Corporateテーマの定義
  - カラーパレットとタイポグラフィの設定
  - UI要素とナビゲーション構造の定義

## 注意事項

1. **一貫性の維持**: すべてのページでこのデザインシステムを適用し、統一感を保つ
2. **カスタマイズ**: CSS変数を使用しているため、簡単にテーマカラーやサイズを変更可能
3. **レスポンシブ**: モバイルファーストを心がけ、全デバイスで適切に表示されることを確認
4. **アクセシビリティ**: キーボードナビゲーションやスクリーンリーダー対応を忘れずに実装
5. **パフォーマンス**: 不要なアニメーションや重い要素は避け、業務システムに適したパフォーマンスを維持