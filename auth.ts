import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from '@/lib/db/mongoose'
import User from '@/lib/db/models/User'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        role: { label: 'Role', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null
        }
        try {
          await connectDB()
          const normalizedEmail = (credentials.email as string).toLowerCase().trim()
          const user = await User.findOne({
            email: normalizedEmail,
            role: credentials.role,
          }).select('+passwordHash')

          if (!user) return null

          // Brute-force lockout check (15 minutes after 5 failed attempts)
          if (user.lockUntil && user.lockUntil > new Date()) {
            throw new Error('ACCOUNT_LOCKED')
          }

          if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
            throw new Error('ACCOUNT_SUSPENDED')
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
          if (!isValid) {
            // Track failed attempts and lock account if threshold reached
            const attempts = (user.loginAttempts || 0) + 1
            const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null
            User.findByIdAndUpdate(user._id, {
              loginAttempts: attempts,
              ...(lockUntil && { lockUntil }),
            }).exec().catch(() => {})
            return null
          }

          // Successful authentication: reset failed attempts & update lastLogin non-blocking
          User.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
            loginAttempts: 0,
            lockUntil: null,
          }).exec().catch(() => {})

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status,
            emailVerified: user.emailVerified,
          }
        } catch (error) {
          if (
            error instanceof Error &&
            (error.message === 'ACCOUNT_SUSPENDED' || error.message === 'ACCOUNT_LOCKED')
          ) {
            throw error
          }
          return null
        }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.status = (user as any).status
        token.emailVerified = (user as any).emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as any).id = token.sub!
        ;(session.user as any).role = token.role as string
        ;(session.user as any).status = token.status as string
        ;(session.user as any).emailVerified = token.emailVerified
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
})
