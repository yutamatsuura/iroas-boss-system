/**
 * IROAS BOSS System - Type Definitions
 * システム全体で使用する型定義
 */

// ===== 共通型 =====
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationParams {
  page: number
  size: number
  total: number
}

export interface ListResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

// ===== 会員関連型 =====
export interface Member {
  id: number
  member_code: string
  family_name: string
  given_name: string
  family_name_kana?: string
  given_name_kana?: string
  email: string
  phone?: string
  postal_code?: string
  prefecture?: string
  city?: string
  address_line?: string
  status: 'active' | 'suspended' | 'withdrawn' | 'pending'
  is_active: boolean
  organization_level: number
  binary_position?: 'L' | 'R'
  registration_date: string
  activation_date?: string
  suspension_date?: string
  withdrawal_date?: string
  total_sales: number
  total_rewards: number
  bank_name?: string
  branch_name?: string
  account_type?: string
  account_number?: string
  account_holder?: string
  sponsor?: {
    id: number
    member_code: string
    full_name: string
  }
  created_at: string
  updated_at?: string
}

export interface MemberCreate {
  member_code: string
  family_name: string
  given_name: string
  family_name_kana?: string
  given_name_kana?: string
  email: string
  phone?: string
  postal_code?: string
  prefecture?: string
  city?: string
  address_line?: string
  sponsor_id?: number
  upline_id?: number
  binary_position?: 'L' | 'R'
  bank_name?: string
  branch_name?: string
  account_type?: string
  account_number?: string
  account_holder?: string
}

export interface MemberUpdate {
  family_name?: string
  given_name?: string
  family_name_kana?: string
  given_name_kana?: string
  email?: string
  phone?: string
  postal_code?: string
  prefecture?: string
  city?: string
  address_line?: string
  status?: 'active' | 'suspended' | 'withdrawn' | 'pending'
  bank_name?: string
  branch_name?: string
  account_type?: string
  account_number?: string
  account_holder?: string
  notes?: string
}

export interface MemberStats {
  total_members: number
  active_members: number
  suspended_members: number
  withdrawn_members: number
  pending_members: number
  new_registrations_this_month: number
}

// ===== ダッシュボード関連型 =====
export interface DashboardStats {
  monthly_sales: number
  active_members: number
  suspended_members: number
  withdrawn_members: number
  unpaid_count: number
  total_revenue: number
  growth_rates: {
    sales: number
    active_members: number
    suspended_members: number
    withdrawn_members: number
    revenue: number
  }
  alerts: AlertItem[]
}

export interface AlertItem {
  type: 'error' | 'warning' | 'info'
  message: string
}

export interface ChartData {
  labels: string[]
  sales: number[]
  members: number[]
}

// ===== 認証関連型 =====
export interface User {
  id: number
  email: string
  full_name: string
  role: string
  is_active: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface Token {
  access_token: string
  token_type: string
  expires_in: number
}

// ===== 決済関連型 =====
export interface Payment {
  id: number
  member_id: number
  amount: number
  currency: string
  payment_method: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded'
  description?: string
  payment_date?: string
  due_date?: string
  created_at: string
}

// ===== フォーム関連型 =====
export interface FormFieldProps {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  error?: string
}