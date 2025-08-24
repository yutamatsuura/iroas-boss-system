/**
 * IROAS BOSS System - Authentication Context
 * 認証状態管理
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authAPI, apiUtils } from '@/services/api'
import type { User, LoginRequest } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // 初期化：既存の認証状態をチェック
  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = apiUtils.getUser()
      const isAuthenticated = apiUtils.isAuthenticated()

      if (isAuthenticated && savedUser) {
        try {
          // APIから最新のユーザー情報を取得
          const currentUser = await authAPI.me()
          setUser(currentUser)
        } catch (error) {
          // トークンが無効な場合はクリア
          apiUtils.logout()
          setUser(null)
        }
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  // ログイン
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true)
      
      // トークン取得
      const token = await authAPI.login(credentials)
      
      // ユーザー情報取得
      const userData = await authAPI.me()
      
      // ローカルストレージに保存
      apiUtils.setAuth(token, userData)
      setUser(userData)
      
      toast.success('ログインしました')
      navigate('/')
      
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.response?.status === 401) {
        toast.error('メールアドレスまたはパスワードが正しくありません')
      } else {
        toast.error('ログインに失敗しました')
      }
      
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // ログアウト
  const logout = () => {
    apiUtils.logout()
    setUser(null)
    toast.success('ログアウトしました')
    navigate('/login')
  }

  // ユーザー情報更新
  const refreshUser = async () => {
    try {
      if (apiUtils.isAuthenticated()) {
        const userData = await authAPI.me()
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to refresh user:', error)
      logout()
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// カスタムフック
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 認証が必要なコンポーネントをラップするHOC
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()

    React.useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate('/login')
      }
    }, [isAuthenticated, isLoading, navigate])

    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
        </div>
      )
    }

    if (!isAuthenticated) {
      return null
    }

    return <Component {...props} />
  }
}