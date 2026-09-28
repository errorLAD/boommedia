'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import {
  Truck,
  Sparkles,
  Loader2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { INDIAN_STATES } from '@/lib/utils'

const STEPS = ['Owner Details', 'Vehicle Info', 'Transit Routes', 'Ad Spaces & Pricing', 'Review & List']

const VEHICLE_TYPES = [
  { label: 'E-Rickshaw (Toto)', value: 'E_RICKSHAW' },
  { label: 'Auto-Rickshaw', value: 'AUTO_RICKSHAW' },
  { label: 'City Bus', value: 'BUS' },
  { label: 'Tempo / Three Wheeler Loader', value: 'TEMPO' },
]

export default function VehicleSignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1: Owner
  const [owner, setOwner] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  // Step 2: Vehicle
  const [vehicle, setVehicle] = useState({
    vehicleType: 'E_RICKSHAW',
    registrationNumber: '',
    make: 'Mahindra',
    model: 'Treo',
    year: 2024,
  })

  // Step 3: Location
  const [location, setLocation] = useState({
    city: 'Darbhanga',
    state: 'Bihar',
    operatingAreas: 'Tower Chowk, Laheriasarai, DMCH, Station Road',
    mainRoute: 'Station Road to Laheriasarai Chowk',
  })

  // Step 4: Ad Spaces
  const [adSpaces, setAdSpaces] = useState({
    backPanel: true,
    leftSide: true,
    rightSide: true,
    topHood: false,
    perWeekRate: 3500,
    perMonthRate: 12000,
    estimatedDailyExposure: 18000,
  })

  // Handlers
  const validateStep = (step: number) => {
    if (step === 1) {
      if (!owner.name || !owner.email || !owner.phone || !owner.password) {
        toast.error('Please fill all owner account fields')
        return false
      }
      if (owner.password !== owner.confirmPassword) {
        toast.error('Passwords do not match')
        return false
      }
      if (owner.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return false
      }
    } else if (step === 2) {
      if (!vehicle.registrationNumber) {
        toast.error('Please enter the vehicle registration number (e.g. BR-07-EA-1234)')
        return false
      }
    } else if (step === 3) {
      if (!location.city || !location.state) {
        toast.error('City and State are required')
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

      const positions = []
      if (adSpaces.backPanel) positions.push({ position: 'BACK', size: { width: 36, height: 24, unit: 'inches' } })
      if (adSpaces.leftSide) positions.push({ position: 'LEFT', size: { width: 48, height: 18, unit: 'inches' } })
      if (adSpaces.rightSide) positions.push({ position: 'RIGHT', size: { width: 48, height: 18, unit: 'inches' } })
      if (adSpaces.topHood) positions.push({ position: 'TOP', size: { width: 30, height: 12, unit: 'inches' } })

      const areas = location.operatingAreas.split(',').map((a) => a.trim()).filter(Boolean)

      const payload = {
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        password: owner.password,
        role: 'VEHICLE_PARTNER',
        city: location.city,
        state: location.state,
        vehicleData: {
          vehicleType: vehicle.vehicleType,
          registrationNumber: vehicle.registrationNumber,
          make: vehicle.make,
          model: vehicle.model,
          year: Number(vehicle.year),
          city: location.city,
          state: location.state,
          operatingAreas: areas,
          routes: [{ name: location.mainRoute, from: 'Station', to: 'Market' }],
          adPositions: positions,
          pricing: {
            perWeek: adSpaces.perWeekRate,
            perMonth: adSpaces.perMonthRate,
          },
          estimatedDailyExposure: adSpaces.estimatedDailyExposure,
        },
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Vehicle partner registration failed')
      }

      toast.success('Vehicle registered and partner account created!')

      await signIn('credentials', {
        email: owner.email,
        password: owner.password,
        role: 'VEHICLE_PARTNER',
        redirect: false,
      })

      router.push('/vehicle/dashboard')
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
          Vehicle Partner Onboarding • Step {currentStep} of {STEPS.length}
        </p>
      </div>

      <Card className="rounded-3xl border shadow-xl bg-card">
        <div className="p-6 pb-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
            <span>{STEPS[currentStep - 1]}</span>
            <span>{Math.round(progressPercent)}% completed</span>
          </div>
          <Progress value={progressPercent} className="h-2 rounded-full" />
        </div>

        <CardContent className="p-6 pt-4">
          {/* STEP 1: Owner Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Owner Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Owner Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={owner.name}
                    onChange={(e) => setOwner({ ...owner, name: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Email Address *</Label>
                  <Input
                    required
                    type="email"
                    placeholder="ramesh@fleet.com"
                    value={owner.email}
                    onChange={(e) => setOwner({ ...owner, email: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Mobile Phone (linked to UPI/Bank) *</Label>
                  <Input
                    required
                    placeholder="+91 98765 43210"
                    value={owner.phone}
                    onChange={(e) => setOwner({ ...owner, phone: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Password *</Label>
                  <Input
                    required
                    type="password"
                    placeholder="Min 6 characters"
                    value={owner.password}
                    onChange={(e) => setOwner({ ...owner, password: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Confirm Password *</Label>
                  <Input
                    required
                    type="password"
                    placeholder="Repeat password"
                    value={owner.confirmPassword}
                    onChange={(e) => setOwner({ ...owner, confirmPassword: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Vehicle Info */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Vehicle Specifications</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vehicle Type *</Label>
                  <Select
                    value={vehicle.vehicleType}
                    onValueChange={(val: string) => setVehicle({ ...vehicle, vehicleType: val })}
                  >
                    <SelectTrigger className="h-10 rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {VEHICLE_TYPES.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vehicle Registration / Plate Number *</Label>
                  <Input
                    required
                    placeholder="e.g. BR-07-EA-4521"
                    value={vehicle.registrationNumber}
                    onChange={(e) =>
                      setVehicle({ ...vehicle, registrationNumber: e.target.value.toUpperCase() })
                    }
                    className="h-10 rounded-xl text-sm uppercase"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Make (Brand)</Label>
                    <Input
                      placeholder="e.g. Mahindra, Bajaj, Piaggio"
                      value={vehicle.make}
                      onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })}
                      className="h-10 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Model</Label>
                    <Input
                      placeholder="e.g. Treo, Compact"
                      value={vehicle.model}
                      onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })}
                      className="h-10 rounded-xl text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Manufacturing Year</Label>
                    <Input
                      type="number"
                      value={vehicle.year}
                      onChange={(e) =>
                        setVehicle({ ...vehicle, year: parseInt(e.target.value) || 2024 })
                      }
                      className="h-10 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Location & Routes */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Operating City & Routes</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">City / District *</Label>
                  <Input
                    required
                    placeholder="e.g. Darbhanga"
                    value={location.city}
                    onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">State *</Label>
                  <Select
                    value={location.state}
                    onValueChange={(val: string) => setLocation({ ...location, state: val })}
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
                <Label className="text-xs font-semibold">Major Operating Neighborhoods & Hubs</Label>
                <Input
                  placeholder="Comma-separated: Tower Chowk, DMCH, Benta, Station..."
                  value={location.operatingAreas}
                  onChange={(e) => setLocation({ ...location, operatingAreas: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Primary Daily Route</Label>
                <Input
                  placeholder="e.g. Darbhanga Junction to Laheriasarai Court"
                  value={location.mainRoute}
                  onChange={(e) => setLocation({ ...location, mainRoute: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Ad Spaces & Pricing */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-foreground">Available Ad Positions & Rates</h3>
              <div className="space-y-3 p-4 rounded-2xl border bg-muted/20">
                <span className="text-xs font-semibold text-foreground block">Select Available Display Spots:</span>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <Checkbox
                      checked={adSpaces.backPanel}
                      onCheckedChange={(c: any) => setAdSpaces({ ...adSpaces, backPanel: !!c })}
                    />
                    <span>Rear Full Panel (Highest views)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <Checkbox
                      checked={adSpaces.leftSide}
                      onCheckedChange={(c: any) => setAdSpaces({ ...adSpaces, leftSide: !!c })}
                    />
                    <span>Left Passenger Banner</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <Checkbox
                      checked={adSpaces.rightSide}
                      onCheckedChange={(c: any) => setAdSpaces({ ...adSpaces, rightSide: !!c })}
                    />
                    <span>Right Driver Banner</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-medium cursor-pointer">
                    <Checkbox
                      checked={adSpaces.topHood}
                      onCheckedChange={(c: any) => setAdSpaces({ ...adSpaces, topHood: !!c })}
                    />
                    <span>Roof / Top Mounted</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Rate per Week (₹)</Label>
                  <Input
                    type="number"
                    value={adSpaces.perWeekRate}
                    onChange={(e) =>
                      setAdSpaces({ ...adSpaces, perWeekRate: parseInt(e.target.value) || 0 })
                    }
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Rate per Month (₹)</Label>
                  <Input
                    type="number"
                    value={adSpaces.perMonthRate}
                    onChange={(e) =>
                      setAdSpaces({ ...adSpaces, perMonthRate: parseInt(e.target.value) || 0 })
                    }
                    className="h-10 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Confirm Vehicle Listing</h3>
                <p className="text-xs text-muted-foreground">Your advertising space will be listed for brands across India.</p>
              </div>

              <div className="rounded-2xl border p-4 bg-muted/20 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-semibold text-foreground">{owner.name} ({owner.phone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle:</span>
                  <span className="font-semibold text-foreground">
                    {vehicle.vehicleType} • {vehicle.registrationNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hub:</span>
                  <span className="font-semibold text-foreground">{location.city}, {location.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ad Price:</span>
                  <span className="font-semibold text-foreground">₹{adSpaces.perWeekRate}/week • ₹{adSpaces.perMonthRate}/month</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                By listing, you agree to mount brand advertising wraps upon contract acceptance and submit photo verification.
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
              <Button type="button" size="sm" onClick={nextStep} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                Next Step <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                disabled={loading}
                onClick={handleSubmit}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'List My Vehicle & Enter Portal'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
