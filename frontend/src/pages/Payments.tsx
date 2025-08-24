import React from 'react'
import { CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react'

export const Payments: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="stat-card-title">今月の決済総額</div>
            <CreditCard className="h-5 w-5 text-primary-500" />
          </div>
          <div className="stat-card-value">¥2,856,000</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="stat-card-title">処理中</div>
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="stat-card-value text-yellow-600">23件</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="stat-card-title">完了</div>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </div>
          <div className="stat-card-value text-green-600">1,247件</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="stat-card-title">未決済</div>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <div className="stat-card-value text-red-600">15件</div>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="card">
        <div className="card-content">
          <div className="text-center py-12">
            <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">決済管理機能</h3>
            <p className="text-gray-600 mb-6">
              Univapay連携による決済処理・GMO NetBank振込機能を実装予定
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2">実装予定機能：</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Univapayクレジットカード決済</li>
                <li>• 決済状況リアルタイム監視</li>
                <li>• GMO NetBank振込データ生成</li>
                <li>• 決済履歴・エラー管理</li>
                <li>• CSV出力・インポート</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}