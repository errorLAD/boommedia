'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Truck,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Plus,
  Trash2,
  Eye,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { VehicleImageUploader, VehiclePhotoItem } from '@/components/vehicle/VehicleImageUploader'
import { toast } from 'sonner'
import { INDIAN_STATES, formatCurrency } from '@/lib/utils'

const VEHICLE_TYPES = [
  'Auto Rickshaw',
  'Electric 3-Wheeler / E-Rickshaw',
  'Bus',
  'Truck',
  'Tempo / LCV',
  'Delivery Vehicle',
  'Taxi / Cab',
  'Van',
  'Pickup',
  'Other Commercial Vehicle',
]

const FUEL_TYPES = ['Electric', 'Petrol', 'Diesel', 'CNG', 'Other']

const AD_AREAS = [
  { id: 'LEFT_SIDE', label: 'Left Side' },
  { id: 'RIGHT_SIDE', label: 'Right Side' },
  { id: 'FRONT', label: 'Front' },
  { id: 'REAR', label: 'Rear' },
  { id: 'ROOF', label: 'Roof' },
  { id: 'INTERIOR', label: 'Interior' },
  { id: 'FULL_VEHICLE', label: 'Full Vehicle' },
  { id: 'CUSTOM_AREA', label: 'Custom Area' },
]

const AD_FORMATS = [
  'Sticker',
  'Vinyl',
  'Full Wrap',
  'Poster',
  'Digital Screen',
  'Other',
]

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export default function AddVehiclePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Step state
  const [step, setStep] = useState(1)

  // Basic Information
  const [basic, setBasic] = useState({
    title: '',
    vehicleType: 'Electric 3-Wheeler / E-Rickshaw',
    vehicleNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    fuelType: 'Electric',
  })

  // Images
  const [images, setImages] = useState<VehiclePhotoItem[]>([])

  // Advertising
  const [adAreas, setAdAreas] = useState<string[]>(['LEFT_SIDE', 'RIGHT_SIDE', 'REAR'])
  const [adFormats, setAdFormats] = useState<string[]>(['Vinyl', 'Full Wrap'])
  const [price, setPrice] = useState('5000')
  const [priceType, setPriceType] = useState('PER_MONTH')
  const [minDuration, setMinDuration] = useState('1 Month')
  const [securityDeposit, setSecurityDeposit] = useState('')
  const [isNegotiable, setIsNegotiable] = useState(false)

  // Location & Routes
  const [location, setLocation] = useState({
    state: 'Bihar',
    city: 'Darbhanga',
    areas: 'Tower Chowk, Laheriasarai, DMCH, Station Road',
  })

  const [routes, setRoutes] = useState<any[]>([
    {
      startingPoint: 'Darbhanga Railway Station',
      endPoint: 'Tower Chowk',
      majorStops: 'Lalbagh, Donar, VIP Road',
      areasCovered: 'Station Road, Commercial Corridor',
      operatingHours: '8-10 Hours / Day',
      routeFrequency: 'Daily',
      operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
  ])

  // Availability & Description
  const [availabilityStatus, setAvailabilityStatus] = useState('AVAILABLE')
  const [availableFrom, setAvailableFrom] = useState('')
  const [availableUntil, setAvailableUntil] = useState('')
  const [description, setDescription] = useState('')

  const handleAddRoute = () => {
    setRoutes([
      ...routes,
      {
        startingPoint: '',
        endPoint: '',
        majorStops: '',
        areasCovered: '',
        operatingHours: '8-10 Hours / Day',
        routeFrequency: 'Daily',
        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
    ])
  }

  const handleRemoveRoute = (index: number) => {
    setRoutes(routes.filter((_, i) => i !== index))
  }

  const handleRouteFieldChange = (index: number, field: string, val: any) => {
    const updated = [...routes]
    updated[index][field] = val
    setRoutes(updated)
  }

  const handleAreaToggle = (areaId: string) => {
    setAdAreas((prev) =>
      prev.includes(areaId) ? prev.filter((a) => a !== areaId) : [...prev, areaId]
    )
  }

  const handleFormatToggle = (format: string) => {
    setAdFormats((prev) =>
      prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
    )
  }

  const validate = () => {
    if (!basic.title.trim()) {
      toast.error('Vehicle Name / Title is required (e.g. City E-Rickshaw)')
      return false
    }
    if (!basic.vehicleType) {
      toast.error('Vehicle Type is required')
      return false
    }
    if (!location.city.trim() || !location.state) {
      toast.error('City and State are required')
      return false
    }
    if (!price || Number(price) <= 0) {
      toast.error('Please enter a valid monthly advertising price')
      return false
    }
    return true
  }

  const handleSave = async (isDraft = false) => {
    if (!validate()) return

    try {
      setLoading(true)

      const payload = {
        title: basic.title,
        vehicleType: basic.vehicleType,
        vehicleNumber: basic.vehicleNumber.trim().toUpperCase(),
        make: basic.make,
        model: basic.model,
        year: Number(basic.year) || undefined,
        color: basic.color,
        fuelType: basic.fuelType.toUpperCase(),
        images,
        advertisingAreas: adAreas,
        advertisingFormats: adFormats,
        price: Number(price),
        priceType,
        minimumCampaignDuration: minDuration,
        securityDeposit: securityDeposit ? Number(securityDeposit) : undefined,
        isNegotiable,
        state: location.state,
        city: location.city,
        areas: location.areas.split(',').map((a) => a.trim()).filter(Boolean),
        routes: routes.map((r) => ({
          startingPoint: r.startingPoint,
          endPoint: r.endPoint,
          majorStops: typeof r.majorStops === 'string' ? r.majorStops.split(',').map((s: string) => s.trim()).filter(Boolean) : r.majorStops,
          areasCovered: typeof r.areasCovered === 'string' ? r.areasCovered.split(',').map((s: string) => s.trim()).filter(Boolean) : r.areasCovered,
          operatingHours: r.operatingHours,
          routeFrequency: r.routeFrequency,
          operatingDays: r.operatingDays,
        })),
        operatingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        availabilityStatus,
        availableFrom: availableFrom || undefined,
        availableUntil: availableUntil || undefined,
        description,
        isDraft,
      }

      const res = await fetch('/api/vehicle-partner/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save vehicle')
      }

      toast.success(
        isDraft
          ? 'Vehicle draft saved successfully!'
          : 'Vehicle submitted for verification! Our admin team will review it within 24 hours.'
      )

      router.push('/vehicle/vehicles')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Error adding vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top back & actions */}
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="rounded-xl">
          <Link href="/vehicle/vehicles">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to My Vehicles
          </Link>
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="rounded-xl text-xs"
          >
            <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview Profile
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={loading}
            onClick={() => handleSave(true)}
            className="rounded-xl text-xs"
          >
            Save Draft
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={loading}
            onClick={() => handleSave(false)}
            className="rounded-xl text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm"
          >
            {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <FileCheck className="mr-1.5 h-3.5 w-3.5" />}
            Publish Vehicle
          </Button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Add Your Vehicle</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Create a complete vehicle profile, set advertising rates, add transit routes, and submit for verification.
        </p>
      </div>

      {/* 1. Basic Information */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center">
            <Truck className="mr-2 h-4 w-4 text-amber-500" /> Basic Information
          </CardTitle>
          <CardDescription className="text-xs">
            Identify your vehicle make, registration, and classification.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Type *</Label>
              <Select
                value={basic.vehicleType}
                onValueChange={(val) => setBasic({ ...basic, vehicleType: val })}
              >
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-56">
                  {VEHICLE_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Name / Title *</Label>
              <Input
                required
                placeholder="e.g. City E-Rickshaw — Darbhanga Corridor"
                value={basic.title}
                onChange={(e) => setBasic({ ...basic, title: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Number (Optional initially)</Label>
              <Input
                placeholder="e.g. BR-07-EA-1234"
                value={basic.vehicleNumber}
                onChange={(e) => setBasic({ ...basic, vehicleNumber: e.target.value.toUpperCase() })}
                className="h-10 rounded-xl text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Make</Label>
              <Input
                placeholder="e.g. Mahindra, Bajaj, Piaggio"
                value={basic.make}
                onChange={(e) => setBasic({ ...basic, make: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Model</Label>
              <Input
                placeholder="e.g. Treo, Compact, Maxima"
                value={basic.model}
                onChange={(e) => setBasic({ ...basic, model: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Year</Label>
              <Input
                type="number"
                min={1990}
                max={new Date().getFullYear() + 1}
                value={basic.year}
                onChange={(e) => setBasic({ ...basic, year: Number(e.target.value) })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Vehicle Color</Label>
              <Input
                placeholder="e.g. Green & Yellow, White, Blue"
                value={basic.color}
                onChange={(e) => setBasic({ ...basic, color: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Fuel Type</Label>
              <Select
                value={basic.fuelType}
                onValueChange={(val) => setBasic({ ...basic, fuelType: val })}
              >
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {FUEL_TYPES.map((f) => (
                    <SelectItem key={f} value={f} className="text-xs">
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Vehicle Images */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center">
            <Sparkles className="mr-2 h-4 w-4 text-amber-500" /> Vehicle Photos
          </CardTitle>
          <CardDescription className="text-xs">
            Upload clear photos from multiple perspectives (Front, Rear, Left, Right, Interior, Advertising Area).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VehicleImageUploader images={images} onChange={setImages} />
        </CardContent>
      </Card>

      {/* 3. Advertising Information & Pricing */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center">
            <Layers className="mr-2 h-4 w-4 text-amber-500" /> Advertising Spaces & Rates
          </CardTitle>
          <CardDescription className="text-xs">
            Specify which parts of the vehicle can carry branding and set your monthly rate.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Areas */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Advertising Areas Available *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AD_AREAS.map((a) => (
                <div
                  key={a.id}
                  onClick={() => handleAreaToggle(a.id)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    adAreas.includes(a.id)
                      ? 'border-amber-500 bg-amber-500/10 text-foreground font-semibold'
                      : 'border-border text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <Checkbox checked={adAreas.includes(a.id)} />
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formats */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Advertising Type / Formats Accepted *</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AD_FORMATS.map((f) => (
                <div
                  key={f}
                  onClick={() => handleFormatToggle(f)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                    adFormats.includes(f)
                      ? 'border-amber-500 bg-amber-500/10 text-foreground font-semibold'
                      : 'border-border text-muted-foreground hover:bg-muted/40'
                  }`}
                >
                  <Checkbox checked={adFormats.includes(f)} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Price * (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                  ₹
                </span>
                <Input
                  required
                  type="number"
                  placeholder="5000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-8 h-10 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Price Type</Label>
              <Select value={priceType} onValueChange={setPriceType}>
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="PER_MONTH" className="text-xs">Per Month (Recommended)</SelectItem>
                  <SelectItem value="PER_WEEK" className="text-xs">Per Week</SelectItem>
                  <SelectItem value="PER_DAY" className="text-xs">Per Day</SelectItem>
                  <SelectItem value="PER_CAMPAIGN" className="text-xs">Per Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Minimum Campaign Duration</Label>
              <Select value={minDuration} onValueChange={setMinDuration}>
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="1 Week" className="text-xs">1 Week</SelectItem>
                  <SelectItem value="1 Month" className="text-xs">1 Month</SelectItem>
                  <SelectItem value="3 Months" className="text-xs">3 Months</SelectItem>
                  <SelectItem value="6 Months" className="text-xs">6 Months</SelectItem>
                  <SelectItem value="Custom" className="text-xs">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Security Deposit (Optional ₹)</Label>
              <Input
                type="number"
                placeholder="Optional deposit"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="isNegotiable"
                checked={isNegotiable}
                onCheckedChange={(c) => setIsNegotiable(Boolean(c))}
              />
              <Label htmlFor="isNegotiable" className="text-xs font-semibold cursor-pointer">
                Pricing is negotiable for long-term campaigns
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Routes & Operating Areas */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-amber-500" /> Operating Areas & Routes
            </CardTitle>
            <CardDescription className="text-xs">
              List the primary streets, stops, and corridors this vehicle covers every day.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddRoute}
            className="rounded-xl text-xs"
          >
            <Plus className="mr-1 h-3.5 w-3.5" /> Add Another Route
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">State *</Label>
              <Select
                value={location.state}
                onValueChange={(val) => setLocation({ ...location, state: val })}
              >
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl max-h-56">
                  {INDIAN_STATES.map((st) => (
                    <SelectItem key={st} value={st} className="text-xs">
                      {st}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">City *</Label>
              <Input
                required
                placeholder="e.g. Darbhanga"
                value={location.city}
                onChange={(e) => setLocation({ ...location, city: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Key Operating Areas (comma-separated)</Label>
            <Input
              placeholder="Tower Chowk, Laheriasarai, DMCH, Station Road"
              value={location.areas}
              onChange={(e) => setLocation({ ...location, areas: e.target.value })}
              className="h-10 rounded-xl text-xs"
            />
          </div>

          {/* Route details */}
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-bold text-foreground">Transit Route Details</Label>
            {routes.map((r, idx) => (
              <div key={idx} className="p-4 rounded-xl border bg-muted/20 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-600">Route #{idx + 1}</span>
                  {routes.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveRoute(idx)}
                      className="h-6 w-6 text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Starting Point *</Label>
                    <Input
                      placeholder="e.g. Darbhanga Railway Station"
                      value={r.startingPoint}
                      onChange={(e) => handleRouteFieldChange(idx, 'startingPoint', e.target.value)}
                      className="h-9 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">End Point *</Label>
                    <Input
                      placeholder="e.g. Laheriasarai Tower Chowk"
                      value={r.endPoint}
                      onChange={(e) => handleRouteFieldChange(idx, 'endPoint', e.target.value)}
                      className="h-9 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Major Stops</Label>
                    <Input
                      placeholder="Lalbagh, Donar, VIP Road"
                      value={r.majorStops}
                      onChange={(e) => handleRouteFieldChange(idx, 'majorStops', e.target.value)}
                      className="h-9 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold">Daily Operating Hours</Label>
                    <Input
                      placeholder="e.g. 8-10 Hours / Day"
                      value={r.operatingHours}
                      onChange={(e) => handleRouteFieldChange(idx, 'operatingHours', e.target.value)}
                      className="h-9 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 5. Availability & Description */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center">
            <Clock className="mr-2 h-4 w-4 text-amber-500" /> Availability & Vehicle Story
          </CardTitle>
          <CardDescription className="text-xs">
            Control your advertising availability calendar and describe your vehicle to potential brand clients.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Availability Status</Label>
              <Select value={availabilityStatus} onValueChange={setAvailabilityStatus}>
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="AVAILABLE" className="text-xs">Available for Advertising</SelectItem>
                  <SelectItem value="BOOKED" className="text-xs">Booked</SelectItem>
                  <SelectItem value="MAINTENANCE" className="text-xs">Maintenance</SelectItem>
                  <SelectItem value="NOT_AVAILABLE" className="text-xs">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Available From</Label>
              <Input
                type="date"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Available Until</Label>
              <Input
                type="date"
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">About This Vehicle</Label>
            <Textarea
              rows={4}
              placeholder="Tell brands about this vehicle, its route, operating area, condition and advertising spaces..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-xs resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Save & Publish Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPreviewOpen(true)}
          className="rounded-xl w-full sm:w-auto"
        >
          <Eye className="mr-1.5 h-4 w-4" /> Preview Vehicle
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={() => handleSave(true)}
          className="rounded-xl w-full sm:w-auto"
        >
          Save Draft
        </Button>
        <Button
          type="button"
          disabled={loading}
          onClick={() => handleSave(false)}
          className="rounded-xl w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Publish Vehicle for Verification <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {/* Profile Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Vehicle Profile Preview</DialogTitle>
            <DialogDescription className="text-xs">
              Here is how your vehicle will appear to advertising brands.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            {/* Primary photo preview */}
            <div className="aspect-video w-full rounded-2xl bg-muted overflow-hidden relative border flex items-center justify-center">
              {images.length > 0 ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images.find((i) => i.isPrimary)?.url || images[0].url}
                  alt={basic.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center text-xs text-muted-foreground">
                  <Truck className="h-10 w-10 mx-auto mb-1 text-muted-foreground/60" />
                  No photos uploaded yet
                </div>
              )}
              <Badge className="absolute top-3 left-3 bg-amber-500 text-white text-[10px]">
                {basic.vehicleType}
              </Badge>
              <Badge variant="secondary" className="absolute top-3 right-3 text-[10px]">
                Pending Verification
              </Badge>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">{basic.title || 'Untitled Vehicle'}</h3>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <MapPin className="mr-1 h-3.5 w-3.5 text-amber-500" />
                {location.city}, {location.state} • {basic.vehicleNumber || 'Plate pending'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-muted/40 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Monthly Price</span>
                <span className="font-extrabold text-foreground text-sm">
                  {formatCurrency(Number(price) || 0)} / month
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Availability</span>
                <span className="font-bold text-emerald-600">{availabilityStatus}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground block">Advertising Spaces</span>
              <div className="flex flex-wrap gap-1.5">
                {adAreas.map((a) => (
                  <Badge key={a} variant="outline" className="text-[10px]">
                    {a.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-foreground block">Primary Transit Corridor</span>
              <p className="text-xs text-muted-foreground">
                {routes[0]?.startingPoint && routes[0]?.endPoint
                  ? `${routes[0].startingPoint} → ${routes[0].endPoint}`
                  : 'Transit route not yet specified'}
              </p>
            </div>

            {description && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground block">About</span>
                <p className="text-xs text-muted-foreground whitespace-pre-line">{description}</p>
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)} className="rounded-xl">
              Continue Editing
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setPreviewOpen(false)
                handleSave(false)
              }}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
