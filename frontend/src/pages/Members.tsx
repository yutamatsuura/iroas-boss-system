import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Filter, Edit, Trash2, Eye, UserCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { membersAPI } from '@/services/api'
import type { Member, MemberUpdate } from '@/types'
import { cn } from '@/utils/cn'

// Status mapping
const statusLabels = {
  active: { label: 'アクティブ', color: 'bg-green-100 text-green-800' },
  suspended: { label: '休会', color: 'bg-yellow-100 text-yellow-800' },
  withdrawn: { label: '退会', color: 'bg-red-100 text-red-800' },
  pending: { label: '承認待ち', color: 'bg-gray-100 text-gray-800' }
}

export const Members: React.FC = () => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const queryClient = useQueryClient()

  // Members list query
  const { data: membersData, isLoading, error } = useQuery({
    queryKey: ['members', { 
      skip: (page - 1) * pageSize, 
      limit: pageSize, 
      search, 
      status: statusFilter || undefined 
    }],
    queryFn: () => membersAPI.getMembers({
      skip: (page - 1) * pageSize,
      limit: pageSize,
      search: search || undefined,
      status: statusFilter || undefined
    }),
  })

  // Member stats query
  const { data: stats } = useQuery({
    queryKey: ['member-stats'],
    queryFn: membersAPI.getStats,
  })

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: MemberUpdate }) =>
      membersAPI.updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['member-stats'] })
      toast.success('会員情報を更新しました')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '更新に失敗しました')
    },
  })

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: membersAPI.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] })
      queryClient.invalidateQueries({ queryKey: ['member-stats'] })
      toast.success('会員を削除しました')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '削除に失敗しました')
    },
  })

  const handleStatusChange = async (member: Member, newStatus: string) => {
    if (window.confirm(`${member.family_name} ${member.given_name}さんのステータスを「${statusLabels[newStatus as keyof typeof statusLabels].label}」に変更しますか？`)) {
      updateMemberMutation.mutate({
        id: member.id,
        data: { status: newStatus as any }
      })
    }
  }

  const handleDelete = async (member: Member) => {
    if (window.confirm(`${member.family_name} ${member.given_name}さんを削除しますか？この操作は取り消せません。`)) {
      deleteMemberMutation.mutate(member.id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="stat-card">
            <div className="stat-card-title">総会員数</div>
            <div className="stat-card-value">{stats.total_members.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">アクティブ</div>
            <div className="stat-card-value text-green-600">{stats.active_members.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">休会</div>
            <div className="stat-card-value text-yellow-600">{stats.suspended_members.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">退会</div>
            <div className="stat-card-value text-red-600">{stats.withdrawn_members.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-card-title">今月新規</div>
            <div className="stat-card-value text-blue-600">{stats.new_registrations_this_month.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="会員名、会員コード、メールで検索..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input"
              >
                <option value="">全てのステータス</option>
                <option value="active">アクティブ</option>
                <option value="suspended">休会</option>
                <option value="withdrawn">退会</option>
                <option value="pending">承認待ち</option>
              </select>

              {/* Add Member Button */}
              <button className="btn btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                会員追加
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="card">
        <div className="card-content p-0">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">読み込み中...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-head">会員情報</th>
                    <th className="table-head">連絡先</th>
                    <th className="table-head">ステータス</th>
                    <th className="table-head">登録日</th>
                    <th className="table-head">売上・報酬</th>
                    <th className="table-head">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {membersData?.members?.map((member) => (
                    <tr key={member.id} className="table-row">
                      <td className="table-cell">
                        <div>
                          <div className="font-medium text-gray-900">
                            {member.family_name} {member.given_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {member.member_code}
                          </div>
                          {member.family_name_kana && member.given_name_kana && (
                            <div className="text-xs text-gray-400">
                              {member.family_name_kana} {member.given_name_kana}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="text-sm">
                          <div>{member.email}</div>
                          {member.phone && (
                            <div className="text-gray-500">{member.phone}</div>
                          )}
                        </div>
                      </td>
                      <td className="table-cell">
                        <select
                          value={member.status}
                          onChange={(e) => handleStatusChange(member, e.target.value)}
                          className={cn(
                            'text-xs px-2 py-1 rounded-full border-0 font-medium',
                            statusLabels[member.status as keyof typeof statusLabels].color
                          )}
                          disabled={updateMemberMutation.isLoading}
                        >
                          <option value="active">アクティブ</option>
                          <option value="suspended">休会</option>
                          <option value="withdrawn">退会</option>
                          <option value="pending">承認待ち</option>
                        </select>
                      </td>
                      <td className="table-cell text-sm text-gray-600">
                        {formatDate(member.registration_date)}
                      </td>
                      <td className="table-cell text-sm">
                        <div>売上: {formatCurrency(member.total_sales)}</div>
                        <div>報酬: {formatCurrency(member.total_rewards)}</div>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(member)}
                            disabled={deleteMemberMutation.isLoading}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {membersData && membersData.total > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {membersData.total.toLocaleString()}件中 {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, membersData.total)}件を表示
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="btn btn-sm btn-secondary disabled:opacity-50"
                  >
                    前へ
                  </button>
                  <span className="px-3 py-1 text-sm">
                    {page} / {Math.ceil(membersData.total / pageSize)}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= Math.ceil(membersData.total / pageSize)}
                    className="btn btn-sm btn-secondary disabled:opacity-50"
                  >
                    次へ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}