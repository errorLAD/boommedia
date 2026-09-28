'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles,
  Users,
  Truck,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
  IndianRupee,
  Plus,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { INDIAN_STATES, CONTENT_CATEGORIES, formatCurrency } from '@/lib/utils'

function CreateCampaignContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as any) || 'COMBINED'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Campaign Type
  const [campaignType, setCampaignType] = useState<'INFLUENCER' | 'VEHICLE' | 'COMBINED'>(initialType)

  // Step 2: Basics
  const [basics, setBasics] = useState({
    name: '',
    objective: '',
    description: '',
    category: 'Fashion',
    cities: 'Darbhanga, Patna',
    state: 'Bihar',
    startDate: '',
    endDate: '',
  })

  // Step 3: Budget & Deliverables
  const [budget, setBudget] = useState({
    influencerBudget: 15000,
    vehicleBudget: 10000,
  })

  const [deliverables, setDeliverables] = useState([
    { type: 'Instagram Reel', quantity: 3, description: 'Brand product demonstration with discount code' },
    { type: 'Instagram Story Set', quantity: 5, description: 'Direct link stickers and interactive poll' },
  ])

  const [vehicleSpecs, setVehicleSpecs] = useState({
    vehicleCount: 5,
    vehicleType: 'E_RICKSHAW',
    durationWeeks: 4,
  })

  // Calculations
  const calculatedInfluencerBudget = campaignType === 'VEHICLE' ? 0 : Number(budget.influencerBudget) || 0
  const calculatedVehicleBudget = campaignType === 'INFLUENCER' ? 0 : Number(budget.vehicleBudget) || 0
  const subtotal = calculatedInfluencerBudget + calculatedVehicleBudget
  const platformFee = Math.round(subtotal * 0.1) // 10% platform fee
  const totalCampaignCost = subtotal + platformFee

  const addDeliverable = () => {
    setDeliverables([...deliverables, { type: 'Instagram Post', quantity: 2, description: 'Feed post' }])
  }

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index))
  }

  const validateStep = (s: number) => {
    if (s === 2) {
      if (!basics.name || !basics.objective || !basics.description) {
        toast.error('Please fill campaign name, objective, and description')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1))
    }
  }

  const handlePrev = () => {
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleCreateCampaign = async (publishNow = false) => {
    try {
      setLoading(true)

      const cityList = basics.cities.split(',').map((c) => c.trim()).filter(Boolean)

      const payload = {
        name: basics.name,
        type: campaignType,
        objective: basics.objective,
        description: basics.description,
        category: basics.category,
        cities: cityList,
        states: [basics.state],
        startDate: basics.startDate || new Date(),
        endDate: basics.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        budget: {
          total: totalCampaignCost,
          influencer: calculatedInfluencerBudget,
          vehicle: calculatedVehicleBudget,
          platformFee,
          currency: 'INR',
        },
        deliverables,
        status: publishNow ? 'PUBLISHED' : 'DRAFT',
      }

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Failed to create campaign')
      }

      toast.success(
        publishNow
          ? 'Campaign created and published successfully!'
          : 'Campaign saved as draft.'
      )

      router.push(`/brand/campaigns/${json.data._id}`)
      router.refresh()
    } catch (err: any) {
      console.error('Create campaign error:', err)
      toast.error(err.message || 'Error creating campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Create a New Marketing Campaign
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Launch digital influence, offline transit reach, or a synchronized combined campaign from one dashboard.
        </p>
      </div>

      {/* Steps Breadcrumb */}
      <div className="flex items-center justify-between border-b pb-4 text-xs font-semibold text-muted-foreground">
        {[
          { n: 1, title: 'Campaign Model' },
          { n: 2, title: 'Overview & Target' },
          { n: 3, title: 'Budget & Deliverables' },
          { n: 4, title: 'Review & Launch' },
        ].map((item) => (
          <div
            key={item.n}
            className={`flex items-center space-x-2 ${
              step >= item.n ? 'text-primary font-bold' : ''
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                step >= item.n
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {item.n}
            </span>
            <span className="hidden sm:inline">{item.title}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: Type Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold text-foreground">Select Campaign Model</h2>
            <p className="text-xs text-muted-foreground">Choose the advertising channels best suited for your brand objective.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Influencer Card */}
            <div
              onClick={() => setCampaignType('INFLUENCER')}
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                campaignType === 'INFLUENCER'
                  ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-600/20'
                  : 'border-border bg-card hover:border-border/80'
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-foreground mb-1">Managed Influencer Agency</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Submit project brief to BoomMedia Agency. Our team vets creators, builds a custom media plan, and coordinates execution.
              </p>
            </div>

            {/* Vehicle Card */}
            <div
              onClick={() => setCampaignType('VEHICLE')}
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                campaignType === 'VEHICLE'
                  ? 'border-amber-500 bg-amber-50/20 shadow-md ring-2 ring-amber-500/20'
                  : 'border-border bg-card hover:border-border/80'
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-foreground mb-1">Vehicle Advertising Only</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Street-level billboard banners on e-rickshaws, autos, buses, and commercial fleets across target cities.
              </p>
            </div>

            {/* Combined Card */}
            <div
              onClick={() => setCampaignType('COMBINED')}
              className={`rounded-2xl border-2 p-6 cursor-pointer transition-all ${
                campaignType === 'COMBINED'
                  ? 'border-primary bg-primary/5 shadow-md ring-2 ring-primary/20'
                  : 'border-border bg-card hover:border-border/80'
              }`}
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-bold text-base text-foreground">Combined 360°</h3>
                <Badge className="bg-primary text-white text-[10px]">Recommended</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Synchronize digital influencer reels with offline street vehicle branding for maximum brand recall in your city.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Basics & Target */}
      {step === 2 && (
        <Card className="rounded-3xl border p-6 space-y-4 bg-card">
          <h2 className="text-lg font-bold text-foreground">Campaign Details & Location Targeting</h2>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Campaign Name *</Label>
              <Input
                required
                placeholder="e.g. Festive Launch 2026 — Bihar Expansion"
                value={basics.name}
                onChange={(e) => setBasics({ ...basics, name: e.target.value })}
                className="h-10 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Primary Marketing Objective *</Label>
              <Input
                required
                placeholder="e.g. Increase retail store walk-ins and boost local brand recall"
                value={basics.objective}
                onChange={(e) => setBasics({ ...basics, objective: e.target.value })}
                className="h-10 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Detailed Description & Instructions *</Label>
              <Textarea
                rows={3}
                placeholder="Explain your product, campaign theme, key hashtags, and what you expect from creators and vehicle partners..."
                value={basics.description}
                onChange={(e) => setBasics({ ...basics, description: e.target.value })}
                className="rounded-xl text-sm resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Industry / Category</Label>
                <Select
                  value={basics.category}
                  onValueChange={(val: string) => setBasics({ ...basics, category: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56 rounded-xl">
                    {CONTENT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Target State</Label>
                <Select
                  value={basics.state}
                  onValueChange={(val: string) => setBasics({ ...basics, state: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue />
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
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Target Cities / Hubs (comma separated)</Label>
              <Input
                placeholder="e.g. Darbhanga, Patna, Muzaffarpur, Samastipur"
                value={basics.cities}
                onChange={(e) => setBasics({ ...basics, cities: e.target.value })}
                className="h-10 rounded-xl text-sm"
              />
            </div>
          </div>
        </Card>
      )}

      {/* STEP 3: Budget & Deliverables */}
      {step === 3 && (
        <div className="space-y-6">
          <Card className="rounded-3xl border p-6 space-y-4 bg-card">
            <h2 className="text-lg font-bold text-foreground">Budget Allocation (₹)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(campaignType === 'INFLUENCER' || campaignType === 'COMBINED') && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center">
                    <Users className="mr-1.5 h-3.5 w-3.5 text-indigo-600" />
                    Influencer Budget (₹)
                  </Label>
                  <Input
                    type="number"
                    value={budget.influencerBudget}
                    onChange={(e) =>
                      setBudget({ ...budget, influencerBudget: parseInt(e.target.value) || 0 })
                    }
                    className="h-10 rounded-xl text-sm font-bold"
                  />
                  <span className="text-[11px] text-muted-foreground">Pool for hiring content creators</span>
                </div>
              )}

              {(campaignType === 'VEHICLE' || campaignType === 'COMBINED') && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold flex items-center">
                    <Truck className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                    Vehicle Advertising Budget (₹)
                  </Label>
                  <Input
                    type="number"
                    value={budget.vehicleBudget}
                    onChange={(e) =>
                      setBudget({ ...budget, vehicleBudget: parseInt(e.target.value) || 0 })
                    }
                    className="h-10 rounded-xl text-sm font-bold"
                  />
                  <span className="text-[11px] text-muted-foreground">Pool for hiring vehicle ad spaces</span>
                </div>
              )}
            </div>

            {/* Platform Fee & Total Calculation */}
            <div className="rounded-2xl border bg-muted/20 p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal Partner Payouts:</span>
                <span className="font-semibold text-foreground">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Facilitation Fee (10%):</span>
                <span className="font-semibold text-primary">{formatCurrency(platformFee)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm">
                <span className="font-bold text-foreground">Total Campaign Cost:</span>
                <span className="font-extrabold text-foreground text-base">
                  {formatCurrency(totalCampaignCost)}
                </span>
              </div>
            </div>
          </Card>

          {/* Deliverables List (If influencer or combined) */}
          {(campaignType === 'INFLUENCER' || campaignType === 'COMBINED') && (
            <Card className="rounded-3xl border p-6 space-y-4 bg-card">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-foreground">Expected Creator Deliverables</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDeliverable}
                  className="rounded-xl text-xs"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Deliverable
                </Button>
              </div>

              <div className="space-y-3">
                {deliverables.map((d, idx) => (
                  <div key={idx} className="p-3 rounded-2xl border bg-muted/20 flex items-center gap-3">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <Input
                        value={d.type}
                        onChange={(e) => {
                          const updated = [...deliverables]
                          updated[idx].type = e.target.value
                          setDeliverables(updated)
                        }}
                        placeholder="Format (e.g. Reel)"
                        className="h-9 rounded-xl text-xs"
                      />
                      <Input
                        type="number"
                        value={d.quantity}
                        onChange={(e) => {
                          const updated = [...deliverables]
                          updated[idx].quantity = parseInt(e.target.value) || 1
                          setDeliverables(updated)
                        }}
                        placeholder="Qty"
                        className="h-9 rounded-xl text-xs"
                      />
                      <Input
                        value={d.description}
                        onChange={(e) => {
                          const updated = [...deliverables]
                          updated[idx].description = e.target.value
                          setDeliverables(updated)
                        }}
                        placeholder="Specific instructions"
                        className="h-9 rounded-xl text-xs sm:col-span-1"
                      />
                    </div>
                    {deliverables.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDeliverable(idx)}
                        className="text-muted-foreground hover:text-destructive p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* STEP 4: Review & Launch */}
      {step === 4 && (
        <Card className="rounded-3xl border p-6 space-y-6 bg-card">
          <div className="text-center space-y-1">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Review & Confirm Campaign</h2>
            <p className="text-xs text-muted-foreground">Verify all budget allocations and location targets.</p>
          </div>

          <div className="rounded-2xl border p-4 bg-muted/20 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Campaign Name:</span>
              <span className="font-semibold text-foreground">{basics.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model:</span>
              <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                {campaignType}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Target Locations:</span>
              <span className="font-semibold text-foreground">
                {basics.cities} ({basics.state})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Partner Pool:</span>
              <span className="font-semibold text-foreground">
                {calculatedInfluencerBudget > 0 && `₹${calculatedInfluencerBudget} (Influencer) `}
                {calculatedVehicleBudget > 0 && `₹${calculatedVehicleBudget} (Vehicle)`}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm font-bold">
              <span>Total Cost (with 10% platform fee):</span>
              <span className="text-primary text-base">{formatCurrency(totalCampaignCost)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleCreateCampaign(false)}
              className="rounded-xl w-full sm:w-auto"
            >
              Save as Draft
            </Button>
            <Button
              type="button"
              disabled={loading}
              onClick={() => handleCreateCampaign(true)}
              className="rounded-xl w-full sm:w-auto bg-primary text-white font-semibold shadow-md"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : campaignType === 'INFLUENCER' ? (
                'Submit Brief to Agency'
              ) : (
                'Publish & Fund Campaign'
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between border-t pt-4">
        {step > 1 ? (
          <Button type="button" variant="outline" size="sm" onClick={handlePrev} className="rounded-xl">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back
          </Button>
        ) : (
          <div />
        )}

        {step < 4 && (
          <Button type="button" size="sm" onClick={handleNext} className="rounded-xl bg-primary text-white font-semibold">
            Next Step <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function CreateCampaignPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <CreateCampaignContent />
    </React.Suspense>
  )
}
