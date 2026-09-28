import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_AUTH_PATHS = [
  '/admin/login',
  '/brand/login',
  '/brand/register',
  '/brand/signup',
  '/vehicle/login',
  '/vehicle/register',
  '/vehicle/signup',
  '/influencer/login',
  '/influencer/signup',
]

const ROLE_ROUTES: Record<string, string> = {
  '/brand': 'BRAND',
  '/vehicle': 'VEHICLE_PARTNER',
  '/influencer': 'INFLUENCER',
  '/admin': 'ADMIN',
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Public authentication routes must remain reachable without a session
  if (PUBLIC_AUTH_PATHS.some((authPath) => path === authPath || path.startsWith(`${authPath}/`))) {
    return NextResponse.next()
  }

  // Check if path requires auth
  const matchedEntry = Object.entries(ROLE_ROUTES).find(([prefix]) =>
    path.startsWith(prefix)
  )

  if (!matchedEntry) return NextResponse.next()

  const [, requiredRole] = matchedEntry

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  })

  // Not logged in
  if (!token) {
    const loginMap: Record<string, string> = {
      BRAND: '/brand/login',
      INFLUENCER: '/influencer/login',
      VEHICLE_PARTNER: '/vehicle/login',
      ADMIN: '/admin/login',
    }
    const loginUrl = loginMap[requiredRole] || '/brand/login'
    return NextResponse.redirect(
      new URL(`${loginUrl}?callbackUrl=${encodeURIComponent(path)}`, req.url)
    )
  }

  // Wrong role (Allow ADMIN to access or inspect role routes if needed)
  const userRole = (token as any).role as string
  if (userRole && userRole !== requiredRole && userRole !== 'ADMIN') {
    const dashboardMap: Record<string, string> = {
      BRAND: '/brand/dashboard',
      INFLUENCER: '/influencer/dashboard',
      VEHICLE_PARTNER: '/vehicle/dashboard',
      ADMIN: '/admin/dashboard',
    }
    return NextResponse.redirect(
      new URL(dashboardMap[userRole] || '/', req.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/brand/:path*',
    '/vehicle/:path*',
    '/influencer/:path*',
    '/admin/:path*',
  ],
}
