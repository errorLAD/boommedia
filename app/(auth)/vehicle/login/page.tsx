'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Truck, Sparkles, Loader2, ArrowRight, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

function VehicleLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/vehicle/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Please enter email and password')
      return
    }

    try {
      setLoading(true)
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        role: 'VEHICLE_PARTNER',
        redirect: false,
      })

      if (res?.error) {
        if (res.error === 'ACCOUNT_LOCKED') {
          toast.error('Account temporarily locked due to failed attempts. Try again in 15 minutes.')
        } else if (res.error === 'ACCOUNT_SUSPENDED') {
          toast.error('Your partner account has been suspended. Please contact support.')
        } else {
          toast.error('Invalid credentials for Vehicle Partner role')
        }
      } else {
        toast.success('Welcome back to your Vehicle Fleet Dashboard!')
        window.location.href = callbackUrl
      }
    } catch (err: any) {
      toast.error('Login failed. Please check credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div className="text-center mb-6 space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white shadow-md">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            Boom<span className="text-primary font-extrabold">Media</span>
          </span>
        </Link>
        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
          Vehicle Partner Login
        </p>
      </div>

      <Card className="rounded-3xl border shadow-xl bg-card">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-bold text-center">Sign In as Vehicle Partner</CardTitle>
          <CardDescription className="text-xs text-center">
            Manage your registered autos, e-rickshaws, and monthly advertising income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="partner@fleet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-10 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">Password</Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-primary hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-10 rounded-xl text-sm"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md mt-2"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Fleet</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground border-t pt-4">
            Want to register your vehicle fleet?{' '}
            <Link href="/vehicle/register" className="text-amber-600 font-bold hover:underline">
              Register Partner Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VehicleLoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <VehicleLoginForm />
    </React.Suspense>
  )
}
