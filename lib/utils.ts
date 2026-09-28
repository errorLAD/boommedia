import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { nanoid } from 'nanoid'

// ─── Tailwind ─────────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Currency & Numbers ───────────────────────────────────────────────────────

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function paisaToRupees(paise: number): number {
  return paise / 100
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100)
}

// ─── Dates ────────────────────────────────────────────────────────────────────

export function formatDate(
  date: Date | string,
  format: 'relative' | 'short' | 'medium' | 'long' = 'medium'
): string {
  const d = new Date(date)

  if (format === 'relative') {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 7) return d.toLocaleDateString('en-IN')
    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  if (format === 'short') {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  if (format === 'long') {
    return d.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  // medium (default)
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function isDateExpired(date: Date | string): boolean {
  return new Date(date) < new Date()
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function daysBetween(start: Date | string, end: Date | string): number {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// ─── Slugs & IDs ──────────────────────────────────────────────────────────────

export function generateSlug(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() +
    '-' +
    nanoid(6)
  )
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function generateToken(length = 32): string {
  return nanoid(length)
}

// ─── Text ─────────────────────────────────────────────────────────────────────

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '…'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function capitalizeFirst(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map(word => capitalizeFirst(word))
    .join(' ')
}

export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`
  return `${count} ${plural ?? singular + 's'}`
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
}

export function isValidGST(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
    gst.toUpperCase()
  )
}

export function isValidIFSC(ifsc: string): boolean {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.toUpperCase())
}

export function isValidVehicleReg(reg: string): boolean {
  return /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/.test(
    reg.toUpperCase().replace(/\s/g, '')
  )
}

// ─── Error Parsing ────────────────────────────────────────────────────────────

export function parseMongoError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('duplicate key')) {
      if (error.message.includes('email')) return 'Email already registered'
      if (error.message.includes('registrationNumber')) return 'Vehicle already registered'
      if (error.message.includes('slug')) return 'Campaign name already taken'
      return 'Duplicate entry'
    }
    if (error.message.includes('validation failed')) {
      const match = error.message.match(/: (.+)$/)
      return match ? match[1] : 'Validation error'
    }
    return error.message
  }
  return 'An unexpected error occurred'
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

// ─── Files ────────────────────────────────────────────────────────────────────

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

export function isImageFile(filename: string): boolean {
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(
    getFileExtension(filename)
  )
}

export function isVideoFile(filename: string): boolean {
  return ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(
    getFileExtension(filename)
  )
}

// ─── Platform Fee ────────────────────────────────────────────────────────────

export const PLATFORM_FEE_PERCENT = 10 // 10% platform commission

export function calculatePlatformFee(amount: number): number {
  return Math.round(amount * (PLATFORM_FEE_PERCENT / 100))
}

export function calculateGST(amount: number, gstPercent = 18): number {
  return Math.round(amount * (gstPercent / 100))
}

export function calculateTotalWithFees(baseAmount: number): {
  base: number
  platformFee: number
  gst: number
  total: number
} {
  const platformFee = calculatePlatformFee(baseAmount)
  const gst = calculateGST(platformFee)
  return {
    base: baseAmount,
    platformFee,
    gst,
    total: baseAmount + platformFee + gst,
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu & Kashmir',
  'Ladakh',
] as const

export type IndianState = (typeof INDIAN_STATES)[number]

export const CONTENT_CATEGORIES = [
  'Fashion',
  'Beauty',
  'Food',
  'Travel',
  'Tech',
  'Gaming',
  'Fitness',
  'Health',
  'Education',
  'Business',
  'Finance',
  'Entertainment',
  'Lifestyle',
  'Sports',
  'Music',
  'Comedy',
  'Art',
  'Photography',
  'Parenting',
  'Politics',
  'News',
  'Automotive',
  'Real Estate',
  'Other',
] as const

export type ContentCategory = (typeof CONTENT_CATEGORIES)[number]

export const SOCIAL_PLATFORMS = [
  'INSTAGRAM',
  'YOUTUBE',
  'FACEBOOK',
  'TWITTER',
  'LINKEDIN',
  'TIKTOK',
  'OTHER',
] as const

export const VEHICLE_TYPES = [
  'E_RICKSHAW',
  'AUTO_RICKSHAW',
  'BUS',
  'TEMPO',
  'DELIVERY_VEHICLE',
  'COMMERCIAL_VEHICLE',
  'OTHER',
] as const

export const VEHICLE_TYPE_LABELS: Record<string, string> = {
  E_RICKSHAW: 'E-Rickshaw',
  AUTO_RICKSHAW: 'Auto Rickshaw',
  BUS: 'Bus',
  TEMPO: 'Tempo',
  DELIVERY_VEHICLE: 'Delivery Vehicle',
  COMMERCIAL_VEHICLE: 'Commercial Vehicle',
  OTHER: 'Other',
}

export const NICHE_OPTIONS = [
  'Fashion & Style',
  'Beauty & Skincare',
  'Food & Cooking',
  'Travel & Adventure',
  'Technology',
  'Gaming',
  'Fitness & Gym',
  'Health & Wellness',
  'Education',
  'Business & Entrepreneurship',
  'Personal Finance',
  'Entertainment',
  'Lifestyle',
  'Sports',
  'Music & Dance',
  'Comedy & Memes',
  'Art & Craft',
  'Photography',
  'Parenting & Family',
  'Politics & Social Issues',
  'News & Current Affairs',
  'Automotive',
  'Real Estate',
  'Spirituality',
  'Environment',
] as const

/**
 * Escapes special regex characters in a string to safely use it in RegExp or MongoDB $regex queries.
 * Prevents Regular Expression Denial of Service (ReDoS) and syntax errors.
 */
export function escapeRegex(string: string): string {
  if (!string || typeof string !== 'string') return ''
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

