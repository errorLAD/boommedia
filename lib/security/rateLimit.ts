import { NextRequest } from 'next/server'

interface RateLimitRecord {
  count: number
  resetTime: number
}

// Global in-memory cache for sliding-window rate limiting
const tracker = new Map<string, RateLimitRecord>()

// Periodically clean up expired entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now()
    tracker.forEach((record, key) => {
      if (now > record.resetTime) {
        tracker.delete(key)
      }
    })
  }, 5 * 60 * 1000)

  // Allow Node.js process to exit cleanly if timer is only active handle
  if (timer.unref) {
    timer.unref()
  }
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  limit: number
}

/**
 * Checks and updates rate limit for a given key.
 * @param key Unique identifier (e.g. IP address or email)
 * @param limit Maximum allowed requests within window
 * @param windowSeconds Time window in seconds
 */
export function checkRateLimit(
  key: string,
  limit: number = 10,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now()
  const windowMs = windowSeconds * 1000
  const record = tracker.get(key)

  if (!record || now > record.resetTime) {
    tracker.set(key, { count: 1, resetTime: now + windowMs })
    return {
      success: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
      limit,
    }
  }

  if (record.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit,
    }
  }

  record.count += 1
  return {
    success: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
    limit,
  }
}

/**
 * Extracts client IP safely from NextRequest headers
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = req.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }
  return '127.0.0.1'
}
