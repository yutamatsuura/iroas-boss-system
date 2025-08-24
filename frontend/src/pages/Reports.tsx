import React from 'react'
import { BarChart3, TrendingUp, Download, Calendar } from 'lucide-react'

export const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button className="card hover:shadow-md transition-shadow">
          <div className="card-content">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-primary-500 mr-3" />
              <div>
                <div className="font-medium">月次レポート</div>
                <div className="text-sm text-gray-500">売上・報酬集計</div>
              </div>
            </div>
          </div>
        </button>
        <button className="card hover:shadow-md transition-shadow">
          <div className="card-content">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="font-medium">成長分析</div>
                <div className="text-sm text-gray-500">組織成長レポート</div>
              </div>
            </div>
          </div>
        </button>
        <button className="card hover:shadow-md transition-shadow">
          <div className="card-content">
            <div className="flex items-center">
              <Download className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="font-medium">CSV出力</div>
                <div className="text-sm text-gray-500">データエクスポート</div>
              </div>
            </div>
          </div>
        </button>
        <button className="card hover:shadow-md transition-shadow">
          <div className="card-content">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <div className="font-medium">期間別分析</div>
                <div className="text-sm text-gray-500">カスタム期間</div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Coming Soon */}
      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">レポート機能</h3>
            <p className="text-gray-600 mb-6">
              高度な分析・レポート生成機能を実装予定
            </p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-purple-900 mb-2">実装予定機能：</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• 月次・年次売上レポート</li>
                <li>• MLM組織成長分析</li>
                <li>• 報酬計算詳細レポート</li>
                <li>• 会員動向分析</li>
                <li>• カスタムレポート作成</li>
                <li>• PDF・Excel出力</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}