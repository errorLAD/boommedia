'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Briefcase, Sparkles, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { INDIAN_STATES } from '@/lib/utils'

const INDUSTRIES = [
  'E-Commerce & Retail',
  'Food & Beverages',
  'Technology & Software',
  'Education & EdTech',
  'Healthcare & Fitness',
  'Fashion & Apparel',
  'Real Estate',
  'Automotive & Transit',
  'Finance & Banking',
  'Entertainment & Media',
  'Other',
]

export default function BrandSignupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
    industry: '',
    website: '',
    description: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
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
          name: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: 'BRAND',
          companyName: formData.companyName,
          contactPerson: formData.contactPerson,
          city: formData.city,
          state: formData.state,
          industry: formData.industry,
          website: formData.website,
          description: formData.description,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed')
      }

      toast.success('Brand account created successfully! Logging you in...')

      // Auto sign in
      const signInRes = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        role: 'BRAND',
        redirect: false,
      })

      if (signInRes?.ok) {
        router.push('/brand/dashboard')
        router.refresh()
      } else {
        router.push('/brand/login')
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-2xl px-4 py-8">
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
          Brand Registration
        </p>
      </div>

      <Card className="rounded-3xl border shadow-xl bg-card">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl font-bold text-center">Create Brand Account</CardTitle>
          <CardDescription className="text-xs text-center">
            Connect with verified regional micro-influencers and transit advertising fleets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company / Brand Name *</Label>
                <Input
                  required
                  placeholder="e.g. Mithila Handloom"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Contact Person Name *</Label>
                <Input
                  required
                  placeholder="Full name"
                  value={formData.contactPerson}
                  onChange={(e) => handleChange('contactPerson', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Business Email *</Label>
                <Input
                  required
                  type="email"
                  placeholder="marketing@brand.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Phone Number *</Label>
                <Input
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">City *</Label>
                <Input
                  required
                  placeholder="e.g. Darbhanga"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">State *</Label>
                <Select value={formData.state} onValueChange={(val: string) => handleChange('state', val)}>
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 rounded-xl">
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Industry *</Label>
                <Select value={formData.industry} onValueChange={(val: string) => handleChange('industry', val)}>
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 rounded-xl">
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Website (Optional)</Label>
                <Input
                  type="url"
                  placeholder="https://brand.com"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Password *</Label>
                <Input
                  required
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Confirm Password *</Label>
                <Input
                  required
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-semibold">About Your Brand / Products</Label>
              <Textarea
                placeholder="Briefly describe what your brand sells, your target audience, or campaign objectives..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="rounded-xl text-sm resize-none h-20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-md mt-4"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>Complete Brand Registration</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-muted-foreground border-t pt-4">
            Already registered?{' '}
            <Link href="/brand/login" className="text-primary font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
