'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Shield, Lock, Mail, Key, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [show2FA, setShow2FA] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Email and password required')
      return
    }

    try {
      setLoading(true)

      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        role: 'ADMIN',
        redirect: false,
      })

      if (res?.error) {
        if (res.error === 'ACCOUNT_LOCKED') {
          toast.error('Admin account temporarily locked due to failed attempts.')
        } else if (res.error === 'ACCOUNT_SUSPENDED') {
          toast.error('This administrative account has been deactivated.')
        } else {
          toast.error('Invalid administrative credentials')
        }
      } else {
        toast.success('Admin authentication verified')
        window.location.href = '/admin/dashboard'
      }
    } catch (err: any) {
      toast.error('Administrative login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div className="text-center mb-6 space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-rose-500 shadow-xl border border-slate-800">
          <Shield className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">BoomMedia Command Center</h1>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
          Strict Access Control • Admin Authentication
        </p>
      </div>

      <Card className="rounded-3xl border border-border shadow-2xl bg-card">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-lg font-bold text-center">Administrator Sign In</CardTitle>
          <CardDescription className="text-xs text-center">
            Sign in with your authorized admin credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Admin Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="admin@boommedia.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Master Password</Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 rounded-xl text-sm"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>

            {show2FA && (
              <div className="space-y-1.5 animate-in">
                <Label className="text-xs font-semibold">Two-Factor Authentication Code (TOTP)</Label>
                <div className="relative">
                  <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="6-digit code"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="pl-10 h-10 rounded-xl text-sm tracking-widest font-mono"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md mt-2"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Enter</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-[11px] text-muted-foreground border-t pt-4">
            Authorized personnel only. All access attempts are monitored and logged with IP address and timestamp.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
