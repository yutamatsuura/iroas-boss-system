import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { LoginRequest } from '@/types'
import { cn } from '@/utils/cn'

export const Login: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: 'admin@iroas.com',
      password: 'password123'
    }
  })

  // 既にログインしている場合はダッシュボードにリダイレクト
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsSubmitting(true)
      await login(data)
    } catch (error) {
      // エラーはAuthContext内で処理済み
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary-500 rounded-lg flex items-center justify-center">
            <LogIn className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            BOSS System
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            IROAS MLM管理システムにログイン
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                {...register('email', {
                  required: 'メールアドレスは必須です',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: '正しいメールアドレスを入力してください'
                  }
                })}
                type="email"
                className={cn(
                  'input w-full',
                  errors.email && 'border-red-500 focus:ring-red-500'
                )}
                placeholder="admin@iroas.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'パスワードは必須です',
                    minLength: {
                      value: 6,
                      message: 'パスワードは6文字以上で入力してください'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    'input w-full pr-10',
                    errors.password && 'border-red-500 focus:ring-red-500'
                  )}
                  placeholder="パスワードを入力"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={cn(
                'btn btn-primary w-full py-3 text-base',
                (isSubmitting || isLoading) && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isSubmitting || isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ログイン中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  ログイン
                </div>
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-2">デモアカウント</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>メール: admin@iroas.com</div>
              <div>パスワード: password123</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>© 2025 IROAS BOSS System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}