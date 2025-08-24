import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Tailwind CSS クラス名を条件付きで結合するユーティリティ
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}