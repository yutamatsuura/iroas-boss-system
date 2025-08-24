/**
 * IROAS BOSS System - API Client
 * バックエンドAPIとの通信を管理
 */

import axios, { AxiosResponse, AxiosError } from 'axios'
import toast from 'react-hot-toast'
import type { 
  DashboardStats, 
  ChartData, 
  Member, 
  MemberCreate, 
  MemberUpdate, 
  MemberStats,
  ListResponse,
  User,
  Token,
  LoginRequest
} from '@/types'

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const API_V1_PREFIX = '/api/v1'

// Axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}${API_V1_PREFIX}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    } else if (error.response?.status === 500) {
      toast.error('サーバーエラーが発生しました')
    } else if (error.response?.status === 404) {
      toast.error('データが見つかりません')
    } else if (!navigator.onLine) {
      toast.error('ネットワークに接続されていません')
    }
    
    return Promise.reject(error)
  }
)

// ===== 認証API =====
export const authAPI = {
  // ログイン
  login: async (credentials: LoginRequest): Promise<Token> => {
    const formData = new FormData()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)
    
    const response: AxiosResponse<Token> = await apiClient.post('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  // 現在のユーザー情報取得
  me: async (): Promise<User> => {
    const response: AxiosResponse<User> = await apiClient.get('/auth/me')
    return response.data
  },
}

// ===== ダッシュボードAPI =====
export const dashboardAPI = {
  // 統計データ取得
  getStats: async (): Promise<DashboardStats> => {
    const response: AxiosResponse<DashboardStats> = await apiClient.get('/dashboard/stats')
    return response.data
  },

  // チャートデータ取得
  getChartData: async (period: string = 'monthly'): Promise<ChartData> => {
    const response: AxiosResponse<ChartData> = await apiClient.get('/dashboard/chart-data', {
      params: { period }
    })
    return response.data
  },
}

// ===== 会員管理API =====
export const membersAPI = {
  // 会員一覧取得
  getMembers: async (params: {
    skip?: number
    limit?: number
    status?: string
    search?: string
  } = {}): Promise<ListResponse<Member>> => {
    const response: AxiosResponse<ListResponse<Member>> = await apiClient.get('/members/', {
      params
    })
    return response.data
  },

  // 会員統計取得
  getStats: async (): Promise<MemberStats> => {
    const response: AxiosResponse<MemberStats> = await apiClient.get('/members/stats')
    return response.data
  },

  // 会員詳細取得
  getMember: async (id: number): Promise<Member> => {
    const response: AxiosResponse<Member> = await apiClient.get(`/members/${id}`)
    return response.data
  },

  // 会員新規作成
  createMember: async (data: MemberCreate): Promise<Member> => {
    const response: AxiosResponse<Member> = await apiClient.post('/members/', data)
    return response.data
  },

  // 会員情報更新
  updateMember: async (id: number, data: MemberUpdate): Promise<Member> => {
    const response: AxiosResponse<Member> = await apiClient.put(`/members/${id}`, data)
    return response.data
  },

  // 会員削除
  deleteMember: async (id: number): Promise<void> => {
    await apiClient.delete(`/members/${id}`)
  },
}

// ===== ユーティリティ関数 =====
export const apiUtils = {
  // 認証チェック
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token')
    return !!token
  },

  // ユーザー情報取得
  getUser: (): User | null => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // トークン保存
  setAuth: (token: Token, user: User): void => {
    localStorage.setItem('access_token', token.access_token)
    localStorage.setItem('user', JSON.stringify(user))
  },

  // ログアウト
  logout: (): void => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  },
}

// デフォルトエクスポート
export default apiClient