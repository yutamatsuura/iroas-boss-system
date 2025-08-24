import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  FileText, 
  Settings,
  Home
} from 'lucide-react'
import { cn } from '@/utils/cn'

const navigation = [
  { name: 'ダッシュボード', href: '/', icon: Home },
  { name: '会員管理', href: '/members', icon: Users },
  { name: '決済管理', href: '/payments', icon: CreditCard },
  { name: 'レポート', href: '/reports', icon: FileText },
  { name: '設定', href: '/settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const location = useLocation()

  return (
    <div className="w-64 bg-gray-800 text-white">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-primary-400">
          BOSS System
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          IROAS MLM管理
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          IROAS BOSS System v1.0.0
        </div>
      </div>
    </div>
  )
}