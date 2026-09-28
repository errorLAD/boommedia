'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  Users,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Instagram,
  Youtube,
  Plus,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { INDIAN_STATES, CONTENT_CATEGORIES } from '@/lib/utils'

const STEPS = [
  'Account',
  'Socials',
  'Creator Info',
  'Pricing',
  'Portfolio',
  'Review & Submit',
]

const LANGUAGES = ['Hindi', 'English', 'Maithili', 'Bhojpuri', 'Bengali', 'Urdu', 'Punjabi', 'Marathi', 'Tamil', 'Telugu']

export default function InfluencerSignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Account
  const [account, setAccount] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: '',
  })

  // Step 2: Socials
  const [socials, setSocials] = useState([
    { platform: 'INSTAGRAM', handle: '', url: '', followers: 10000 },
  ])

  // Step 3: Creator Info
  const [creatorInfo, setCreatorInfo] = useState({
    niche: '',
    selectedCategories: [] as string[],
    selectedLanguages: ['Hindi', 'English'] as string[],
    avgEngagementRate: 4.2,
    audienceLocation: '',
  })

  // Step 4: Pricing
  const [pricing, setPricing] = useState({
    reel: 3500,
    post: 2500,
    story: 1200,
    youtubeVideo: 7500,
    customCampaign: 15000,
  })

  // Step 5: Portfolio
  const [portfolio, setPortfolio] = useState({
    bio: '',
    sampleUrl: '',
  })

  // Handlers
  const addSocial = () => {
    setSocials([...socials, { platform: 'YOUTUBE', handle: '', url: '', followers: 5000 }])
  }

  const removeSocial = (index: number) => {
    if (socials.length > 1) {
      setSocials(socials.filter((_, i) => i !== index))
    }
  }

  const toggleCategory = (cat: string) => {
    setCreatorInfo((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }))
  }

  const toggleLanguage = (lang: string) => {
    setCreatorInfo((prev) => ({
      ...prev,
      selectedLanguages: prev.selectedLanguages.includes(lang)
        ? prev.selectedLanguages.filter((l) => l !== lang)
        : [...prev.selectedLanguages, lang],
    }))
  }

  const validateStep = (step: number) => {
    if (step === 1) {
      if (!account.name || !account.email || !account.password || !account.city || !account.state) {
        toast.error('Please fill all required account fields')
        return false
      }
      if (account.password !== account.confirmPassword) {
        toast.error('Passwords do not match')
        return false
      }
      if (account.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return false
      }
    } else if (step === 2) {
      if (!socials[0]?.handle) {
        toast.error('Please enter at least one primary social media handle')
        return false
      }
    } else if (step === 3) {
      if (!creatorInfo.niche) {
        toast.error('Please enter your primary creator niche')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(STEPS.length, prev + 1))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const totalFollowers = socials.reduce((acc, s) => acc + (Number(s.followers) || 0), 0)

      const payload = {
        name: account.name,
        email: account.email,
        phone: account.phone,
        password: account.password,
        role: 'INFLUENCER',
        city: account.city,
        state: account.state,
        niche: creatorInfo.niche,
        categories: creatorInfo.selectedCategories.length > 0 ? creatorInfo.selectedCategories : [creatorInfo.niche],
        languages: creatorInfo.selectedLanguages,
        socialAccounts: socials,
        totalFollowers,
        avgEngagementRate: creatorInfo.avgEngagementRate,
        pricing,
        bio: portfolio.bio,
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Creator registration failed')
      }

      toast.success('Creator Studio account created successfully!')

      // Auto login
      await signIn('credentials', {
        email: account.email,
        password: account.password,
        role: 'INFLUENCER',
        redirect: false,
      })

      router.push('/influencer/dashboard')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const progressPercent = (currentStep / STEPS.length) * 100

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
          Creator Onboarding • Step {currentStep} of {STEPS.length}
        </p>
      </div>

      <Card className="rounded-3xl border shadow-xl bg-card">
        {/* Progress Bar */}
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
            <span>{STEPS[currentStep - 1]}</span>
            <span>{Math.round(progressPercent)}% completed</span>
          </div>
          <Progress value={progressPercent} className="h-2 rounded-full" />
        </div>

        <CardContent className="p-6 pt-4">
          {/* STEP 1: Account */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Personal & Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Priya Sharma"
                    value={account.name}
                    onChange={(e) => setAccount({ ...account, name: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="priya@creator.com"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Phone Number *</Label>
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={account.phone}
                    onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">City *</Label>
                  <Input
                    required
                    placeholder="e.g. Darbhanga"
                    value={account.city}
                    onChange={(e) => setAccount({ ...account, city: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">State *</Label>
                  <Select
                    value={account.state}
                    onValueChange={(val: string) => setAccount({ ...account, state: val })}
                  >
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
                  <Label className="text-xs font-semibold">Password *</Label>
                  <Input
                    required
                    type="password"
                    placeholder="Min 6 characters"
                    value={account.password}
                    onChange={(e) => setAccount({ ...account, password: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Confirm Password *</Label>
                  <Input
                    required
                    type="password"
                    placeholder="Repeat password"
                    value={account.confirmPassword}
                    onChange={(e) => setAccount({ ...account, confirmPassword: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Socials */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Connect Social Channels</h3>
                  <p className="text-xs text-muted-foreground">Add channels where you produce and publish content.</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={addSocial} className="rounded-xl text-xs">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Channel
                </Button>
              </div>

              <div className="space-y-3">
                {socials.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <Select
                        value={s.platform}
                        onValueChange={(val: string) => {
                          const updated = [...socials]
                          updated[idx].platform = val
                          setSocials(updated)
                        }}
                      >
                        <SelectTrigger className="w-36 h-9 rounded-xl text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="INSTAGRAM">Instagram</SelectItem>
                          <SelectItem value="YOUTUBE">YouTube</SelectItem>
                          <SelectItem value="FACEBOOK">Facebook</SelectItem>
                          <SelectItem value="TWITTER">Twitter / X</SelectItem>
                        </SelectContent>
                      </Select>

                      {socials.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSocial(idx)}
                          className="text-muted-foreground hover:text-destructive p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-[11px] font-semibold">Handle / Username *</Label>
                        <Input
                          placeholder="@username"
                          value={s.handle}
                          onChange={(e) => {
                            const updated = [...socials]
                            updated[idx].handle = e.target.value
                            setSocials(updated)
                          }}
                          className="h-9 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] font-semibold">Followers / Subscribers *</Label>
                        <Input
                          type="number"
                          placeholder="e.g. 15000"
                          value={s.followers}
                          onChange={(e) => {
                            const updated = [...socials]
                            updated[idx].followers = parseInt(e.target.value) || 0
                            setSocials(updated)
                          }}
                          className="h-9 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Creator Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Content Niche & Languages</h3>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Content Niche *</Label>
                <Input
                  required
                  placeholder="e.g. Fashion, Street Food, Tech, Bhojpuri Comedy"
                  value={creatorInfo.niche}
                  onChange={(e) => setCreatorInfo({ ...creatorInfo, niche: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold block">Select Categories</Label>
                <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-2 border rounded-xl bg-muted/20">
                  {CONTENT_CATEGORIES.map((cat) => {
                    const selected = creatorInfo.selectedCategories.includes(cat)
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                          selected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-card border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold block">Languages You Create In</Label>
                <div className="flex flex-wrap gap-1.5">
                  {LANGUAGES.map((lang) => {
                    const selected = creatorInfo.selectedLanguages.includes(lang)
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selected
                            ? 'bg-purple-600 text-white'
                            : 'bg-card border text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        {lang}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Estimated Engagement Rate (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="4.5"
                    value={creatorInfo.avgEngagementRate}
                    onChange={(e) =>
                      setCreatorInfo({ ...creatorInfo, avgEngagementRate: parseFloat(e.target.value) || 0 })
                    }
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Primary Audience Hub</Label>
                  <Input
                    placeholder="e.g. Bihar & Delhi NCR"
                    value={creatorInfo.audienceLocation}
                    onChange={(e) =>
                      setCreatorInfo({ ...creatorInfo, audienceLocation: e.target.value })
                    }
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Pricing */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-foreground">Set Your Base Deliverable Rates (₹)</h3>
                <p className="text-xs text-muted-foreground">You can customize individual campaign quotes later.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Instagram Reel (₹)</Label>
                  <Input
                    type="number"
                    value={pricing.reel}
                    onChange={(e) => setPricing({ ...pricing, reel: parseInt(e.target.value) || 0 })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Instagram Post (₹)</Label>
                  <Input
                    type="number"
                    value={pricing.post}
                    onChange={(e) => setPricing({ ...pricing, post: parseInt(e.target.value) || 0 })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Story Set (₹)</Label>
                  <Input
                    type="number"
                    value={pricing.story}
                    onChange={(e) => setPricing({ ...pricing, story: parseInt(e.target.value) || 0 })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">YouTube Video Integration (₹)</Label>
                  <Input
                    type="number"
                    value={pricing.youtubeVideo}
                    onChange={(e) => setPricing({ ...pricing, youtubeVideo: parseInt(e.target.value) || 0 })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Portfolio */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Bio & Sample Content</h3>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Short Bio (Introduce yourself to brands)</Label>
                <textarea
                  rows={4}
                  placeholder="Share what makes your community unique, your brand tone, and past collaborations..."
                  value={portfolio.bio}
                  onChange={(e) => setPortfolio({ ...portfolio, bio: e.target.value })}
                  className="w-full rounded-xl border bg-background p-3 text-sm resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Best Sample Reel / Video Link</Label>
                <Input
                  type="url"
                  placeholder="https://www.instagram.com/reel/..."
                  value={portfolio.sampleUrl}
                  onChange={(e) => setPortfolio({ ...portfolio, sampleUrl: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Review Your Profile</h3>
                <p className="text-xs text-muted-foreground">Confirm your information to enter the Creator Studio.</p>
              </div>

              <div className="rounded-2xl border p-4 bg-muted/20 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name & City:</span>
                  <span className="font-semibold text-foreground">{account.name} ({account.city}, {account.state})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Niche:</span>
                  <span className="font-semibold text-foreground">{creatorInfo.niche}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Channels:</span>
                  <span className="font-semibold text-foreground">
                    {socials.map((s) => s.handle).filter(Boolean).join(', ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Starting Post Rate:</span>
                  <span className="font-semibold text-foreground">₹{pricing.post}</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                By clicking Complete Profile, you agree to BoomMedia&apos;s Creator Terms of Service and Escrow Payout guidelines.
              </p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 flex items-center justify-between border-t pt-4">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" size="sm" onClick={prevStep} className="rounded-xl">
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < STEPS.length ? (
              <Button type="button" size="sm" onClick={nextStep} className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Next Step <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={loading}
                onClick={handleSubmit}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Complete Profile & Enter Studio'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
