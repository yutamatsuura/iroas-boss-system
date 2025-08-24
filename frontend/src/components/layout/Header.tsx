import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

// Page titles mapping
const pageTitles: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'ダッシュボード',
    description: '会員状況と決済状況を一覧表示し、月次処理の現状を把握します'
  },
  '/members': {
    title: '会員管理',
    description: '会員情報の管理・編集・組織構造の確認を行います'
  },
  '/payments': {
    title: '決済管理',
    description: '決済処理の状況確認・未決済の管理を行います'
  },
  '/reports': {
    title: 'レポート',
    description: '売上・報酬・会員状況のレポートを生成・確認します'
  }
}

export const Header: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  
  const pageInfo = pageTitles[location.pathname] || { 
    title: 'BOSS System', 
    description: 'IROAS MLM管理システム' 
  }

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout()
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {pageInfo.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {pageInfo.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {user?.full_name || '管理者'}
              </div>
              <div className="text-xs text-gray-500">
                {user?.email || 'admin@iroas.com'}
              </div>
            </div>
            <button className="flex items-center justify-center w-8 h-8 bg-primary-100 rounded-full">
              <User className="h-4 w-4 text-primary-600" />
            </button>
          </div>

          {/* Logout */}
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            title="ログアウト"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}