'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { INDIAN_STATES } from '@/lib/utils'

export default function VehicleRegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    password: '',
    city: '',
    state: 'Bihar',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.companyName || !formData.email || !formData.phone || !formData.password || !formData.city || !formData.state) {
      toast.error('Please fill all required registration fields')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'VEHICLE_PARTNER',
          companyName: formData.companyName,
          city: formData.city,
          state: formData.state,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Vehicle Partner account created! Signing you in...')

      // Auto sign-in
      const signInRes = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        role: 'VEHICLE_PARTNER',
        redirect: false,
      })

      if (signInRes?.error) {
        toast.error('Account created, please sign in with your credentials')
        router.push('/vehicle/login')
      } else {
        window.location.href = '/vehicle/dashboard'
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-xl px-4 py-8">
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
          Vehicle Partner Registration
        </p>
      </div>

      <Card className="rounded-3xl border shadow-xl bg-card">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-2xl font-bold text-center">Join as Vehicle Partner</CardTitle>
          <CardDescription className="text-xs text-center">
            Register your commercial auto rickshaws, e-rickshaws, or fleet to earn recurring monthly advertising income.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Your Name *</Label>
                <Input
                  required
                  placeholder="Full Name / Owner Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company / Fleet Name *</Label>
                <Input
                  required
                  placeholder="e.g. Mithila Transit Fleet"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address *</Label>
                <Input
                  required
                  type="email"
                  placeholder="fleetowner@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mobile Number *</Label>
                <Input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password *</Label>
              <Input
                required
                type="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-10 rounded-xl text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">City *</Label>
                <Input
                  required
                  placeholder="e.g. Darbhanga"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">State *</Label>
                <Select
                  value={formData.state}
                  onValueChange={(val) => setFormData({ ...formData, state: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-56">
                    {INDIAN_STATES.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                </>
              ) : (
                <>
                  Register as Vehicle Partner <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              Already have an account?{' '}
              <Link href="/vehicle/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
