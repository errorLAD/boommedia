import { UserRole } from '@/types'

// ─── Permission Definitions ───────────────────────────────────────────────────

export const ROLE_PERMISSIONS = {
  ADMIN: ['*'],
  BRAND: [
    'campaign:create',
    'campaign:read',
    'campaign:update',
    'campaign:delete',
    'campaign:invite',
    'influencer:read',
    'vehicle:read',
    'application:read',
    'application:accept',
    'application:reject',
    'content:read',
    'content:approve',
    'content:request_revision',
    'payment:create',
    'payment:read',
    'message:send',
    'message:read',
    'review:create',
    'review:read',
    'dispute:create',
    'analytics:brand',
    'savedItem:create',
    'savedItem:read',
    'savedItem:delete',
  ],
  INFLUENCER: [
    'campaign:read',
    'campaign:apply',
    'content:submit',
    'content:read',
    'earnings:read',
    'payout:request',
    'message:send',
    'message:read',
    'review:create',
    'review:read',
    'dispute:create',
    'analytics:influencer',
    'savedItem:create',
    'savedItem:read',
    'savedItem:delete',
    'profile:update',
  ],
  VEHICLE_PARTNER: [
    'campaign:read',
    'campaign:apply',
    'vehicle:create',
    'vehicle:update',
    'vehicle:read',
    'vehicle:delete',
    'earnings:read',
    'payout:request',
    'message:send',
    'message:read',
    'review:create',
    'review:read',
    'dispute:create',
    'savedItem:create',
    'savedItem:read',
    'savedItem:delete',
    'profile:update',
  ],
} as const

export type Permission =
  (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS][number]

// ─── Permission Checker ───────────────────────────────────────────────────────

export function hasPermission(role: UserRole, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] as readonly string[]
  return permissions.includes('*') || permissions.includes(permission)
}

export function hasAnyPermission(role: UserRole, ...permissions: string[]): boolean {
  return permissions.some(p => hasPermission(role, p))
}

export function hasAllPermissions(role: UserRole, ...permissions: string[]): boolean {
  return permissions.every(p => hasPermission(role, p))
}

// ─── Protected Route Map ──────────────────────────────────────────────────────

export const PROTECTED_ROUTES: Record<string, UserRole | UserRole[]> = {
  '/brand': 'BRAND',
  '/brand/campaigns': 'BRAND',
  '/brand/analytics': 'BRAND',
  '/brand/payments': 'BRAND',
  '/influencer/dashboard': 'INFLUENCER',
  '/influencer/earnings': 'INFLUENCER',
  '/influencer/submissions': 'INFLUENCER',
  '/vehicle/dashboard': 'VEHICLE_PARTNER',
  '/vehicle/fleet': 'VEHICLE_PARTNER',
  '/vehicle/earnings': 'VEHICLE_PARTNER',
  '/admin': 'ADMIN',
  '/admin/users': 'ADMIN',
  '/admin/verifications': 'ADMIN',
  '/admin/campaigns': 'ADMIN',
  '/admin/disputes': 'ADMIN',
  '/admin/payouts': 'ADMIN',
  '/admin/analytics': 'ADMIN',
}

// Routes accessible by multiple roles
export const SHARED_ROUTES = ['/messages', '/notifications', '/settings', '/profile']

export function canAccessRoute(role: UserRole, path: string): boolean {
  if (role === 'ADMIN') return true

  // Check shared routes first — available to all authenticated users
  for (const shared of SHARED_ROUTES) {
    if (path.startsWith(shared)) return true
  }

  // Check protected routes
  for (const [prefix, requiredRole] of Object.entries(PROTECTED_ROUTES)) {
    if (path.startsWith(prefix)) {
      if (Array.isArray(requiredRole)) {
        return requiredRole.includes(role)
      }
      return role === requiredRole
    }
  }

  return true // Public route
}

// ─── Role Display Helpers ─────────────────────────────────────────────────────

export const ROLE_LABELS: Record<UserRole, string> = {
  BRAND: 'Brand',
  INFLUENCER: 'Influencer',
  VEHICLE_PARTNER: 'Vehicle Partner',
  ADMIN: 'Admin',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  BRAND: 'blue',
  INFLUENCER: 'purple',
  VEHICLE_PARTNER: 'amber',
  ADMIN: 'red',
}

export const ROLE_DASHBOARD_PATHS: Record<UserRole, string> = {
  BRAND: '/brand/dashboard',
  INFLUENCER: '/influencer/dashboard',
  VEHICLE_PARTNER: '/vehicle/dashboard',
  ADMIN: '/admin/dashboard',
}

export const ROLE_ONBOARDING_PATHS: Record<UserRole, string> = {
  BRAND: '/onboarding/brand',
  INFLUENCER: '/onboarding/influencer',
  VEHICLE_PARTNER: '/onboarding/vehicle',
  ADMIN: '/admin/dashboard',
}
