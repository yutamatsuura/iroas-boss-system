import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp, TrendingDown, Users, AlertTriangle } from 'lucide-react'
import { dashboardAPI } from '@/services/api'
import type { DashboardStats } from '@/types'
import { cn } from '@/utils/cn'

export const Dashboard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardAPI.getStats,
    refetchInterval: 5 * 60 * 1000, // 5分毎に更新
  })

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">データの取得に失敗しました</div>
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary btn-sm"
        >
          再読み込み
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: '当月売上',
      value: `¥${stats?.monthly_sales?.toLocaleString()}`,
      change: `+${stats?.growth_rates.sales}%`,
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: 'アクティブ会員',
      value: stats?.active_members?.toLocaleString(),
      change: `+${stats?.growth_rates.active_members}名`,
      changeType: 'positive' as const,
      icon: Users
    },
    {
      title: '休会会員', 
      value: stats?.suspended_members?.toLocaleString(),
      change: `+${stats?.growth_rates.suspended_members}名`,
      changeType: 'negative' as const,
      icon: Users
    },
    {
      title: '退会会員',
      value: stats?.withdrawn_members?.toLocaleString(), 
      change: `+${stats?.growth_rates.withdrawn_members}名`,
      changeType: 'negative' as const,
      icon: Users
    },
    {
      title: '未決済件数',
      value: stats?.unpaid_count?.toLocaleString(),
      change: '要確認',
      changeType: 'negative' as const,
      icon: AlertTriangle
    },
    {
      title: '今月の報酬総額',
      value: `¥${stats?.total_revenue?.toLocaleString()}`,
      change: `+${stats?.growth_rates.revenue}%`,
      changeType: 'positive' as const,
      icon: TrendingUp
    }
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-card-title">{stat.title}</div>
              <stat.icon className="h-5 w-5 text-primary-500" />
            </div>
            <div className="stat-card-value">{stat.value}</div>
            <div className={cn('stat-card-change', stat.changeType)}>
              {stat.changeType === 'positive' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">月次売上推移</h3>
        </div>
        <div className="card-content">
          <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>チャートライブラリ統合後に売上推移グラフを表示</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold">重要な通知</h3>
        </div>
        <div className="card-content">
          <div className="space-y-3">
            {stats?.alerts.map((alert, index) => (
              <div
                key={index}
                className={cn(
                  'p-4 rounded-md border-l-4',
                  alert.type === 'error' && 'bg-red-50 border-red-500',
                  alert.type === 'warning' && 'bg-yellow-50 border-yellow-500',
                  alert.type === 'info' && 'bg-blue-50 border-blue-500'
                )}
              >
                <div className="flex items-start">
                  <AlertTriangle 
                    className={cn(
                      'h-5 w-5 mr-3 mt-0.5',
                      alert.type === 'error' && 'text-red-500',
                      alert.type === 'warning' && 'text-yellow-500',
                      alert.type === 'info' && 'text-blue-500'
                    )} 
                  />
                  <p className="text-sm text-gray-700">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}