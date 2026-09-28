import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/mongoose'
import Vehicle from '@/lib/db/models/Vehicle'
import User from '@/lib/db/models/User'
import {
  Truck,
  MapPin,
  Eye,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Star,
  Send,
  Navigation,
  FileCheck,
  Maximize2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  await connectDB()

  let vehicle: any = null
  try {
    vehicle = await Vehicle.findById(params.id)
      .populate('partnerId', 'name email phone')
      .lean()
  } catch (err) {
    console.error('Error finding vehicle:', err)
  }

  if (!vehicle) {
    notFound()
  }

  const partner = vehicle.partnerId || {}
  const isVerified = vehicle.verificationStatus === 'VERIFIED'
  const primaryPhoto =
    vehicle.photos?.find((p: any) => p.isPrimary)?.url ||
    vehicle.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&auto=format&fit=crop&q=80'

  const formattedType = (vehicle.vehicleType || 'E_RICKSHAW').replace('_', ' ')

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Title & Badge Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-amber-500 text-white font-semibold capitalize text-xs">
              {formattedType}
            </Badge>
            {isVerified && (
              <Badge variant="secondary" className="bg-emerald-600 text-white text-xs flex items-center space-x-1">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                Verified Transit Partner
              </Badge>
            )}
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground capitalize">
            {formattedType} Advertising Space — {vehicle.city}
          </h1>
          <div className="flex items-center text-xs sm:text-sm text-muted-foreground mt-1">
            <MapPin className="mr-1 h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span>
              {vehicle.city}, {vehicle.state}
            </span>
            {vehicle.registrationNumber && (
              <>
                <span className="mx-2">•</span>
                <span>Reg: {vehicle.registrationNumber}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl">
            <Link href={`/brand/campaigns/create?type=VEHICLE&vehicleId=${vehicle._id}`}>
              Book This Space
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href={`/brand/messages?recipient=${partner._id}`}>
              Contact Owner
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid: Gallery & Details + Pricing Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Photo Gallery */}
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-md bg-muted">
            <Image
              src={primaryPhoto}
              alt={`${formattedType} display space`}
              fill
              className="object-cover"
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="rounded-2xl border p-4 text-center">
              <span className="text-xs text-muted-foreground block">Daily Views</span>
              <p className="text-xl font-bold text-foreground mt-1">
                {formatNumber(vehicle.estimatedDailyExposure || 18000)}+
              </p>
            </Card>
            <Card className="rounded-2xl border p-4 text-center">
              <span className="text-xs text-muted-foreground block">Availability</span>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {vehicle.isAvailable !== false ? 'Available' : 'Booked'}
              </p>
            </Card>
            <Card className="rounded-2xl border p-4 text-center">
              <span className="text-xs text-muted-foreground block">Min Duration</span>
              <p className="text-xl font-bold text-foreground mt-1">
                {vehicle.minimumDuration || 7} Days
              </p>
            </Card>
            <Card className="rounded-2xl border p-4 text-center">
              <span className="text-xs text-muted-foreground block">Fleet Rating</span>
              <div className="flex items-center justify-center space-x-1 mt-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold text-foreground">
                  {(vehicle.rating || 4.8).toFixed(1)}
                </span>
              </div>
            </Card>
          </div>

          {/* Ad Positions & Dimensions */}
          <Card className="rounded-2xl border p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center">
              <Maximize2 className="mr-2 h-4 w-4 text-amber-500" />
              Available Advertising Spots & Dimensions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(vehicle.adPositions || [
                { position: 'BACK', size: { width: 36, height: 24, unit: 'inches' }, description: 'Full rear panel with maximum eye-level following traffic visibility' },
                { position: 'LEFT', size: { width: 48, height: 18, unit: 'inches' }, description: 'Left passenger side exterior branding banner' },
                { position: 'RIGHT', size: { width: 48, height: 18, unit: 'inches' }, description: 'Right exterior driver side branding banner' },
                { position: 'TOP', size: { width: 30, height: 12, unit: 'inches' }, description: 'Top hood / roof mounted illuminated branding' },
              ]).map((pos: any, idx: number) => (
                <div key={idx} className="rounded-xl border p-4 space-y-2 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-bold text-xs uppercase">
                      {pos.position} Panel
                    </Badge>
                    {pos.size && (
                      <span className="text-xs font-semibold text-muted-foreground">
                        {pos.size.width}&quot; × {pos.size.height}&quot; {pos.size.unit}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pos.description || 'Premium high-visibility outdoor vinyl sticker wrap.'}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Operating Areas & Routes */}
          <Card className="rounded-2xl border p-6 space-y-4">
            <h3 className="font-bold text-base text-foreground flex items-center">
              <Navigation className="mr-2 h-4 w-4 text-amber-500" />
              Daily Transit Routes & Operating Zones
            </h3>

            {vehicle.operatingAreas && vehicle.operatingAreas.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-muted-foreground block mb-2">
                  Operating Hubs & Neighborhoods:
                </span>
                <div className="flex flex-wrap gap-2">
                  {vehicle.operatingAreas.map((area: string, i: number) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {vehicle.routes && vehicle.routes.length > 0 ? (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Frequent Routes:
                </span>
                {vehicle.routes.map((r: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-muted/30 border">
                    <span className="font-semibold text-foreground">{r.name}</span>
                    <span className="text-muted-foreground">
                      {r.from} ➔ {r.to} {r.distance ? `(${r.distance} km)` : ''}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Operating across key commercial and commuter transit corridors throughout {vehicle.city}.
              </p>
            )}
          </Card>
        </div>

        {/* Right Col: Pricing & Booking Card */}
        <div className="space-y-6">
          <Card className="rounded-2xl border bg-card p-6 shadow-md sticky top-28 space-y-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Advertising Rate
              </span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {vehicle.pricing?.perWeek
                    ? formatCurrency(vehicle.pricing.perWeek)
                    : vehicle.pricing?.perMonth
                    ? formatCurrency(vehicle.pricing.perMonth)
                    : '₹4,999'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {vehicle.pricing?.perWeek ? '/week' : '/month'}
                </span>
              </div>
            </div>

            <div className="space-y-3 border-t border-b border-border/70 py-4 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Proof of Installation Guaranteed</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>GPS Route Verification</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Professional Printing & Wrap Support</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Held in Escrow until completion</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-2.5">
              <Button asChild className="w-full rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
                <Link href={`/brand/campaigns/create?type=VEHICLE&vehicleId=${vehicle._id}`}>
                  Book This Vehicle
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href={`/brand/messages?recipient=${partner._id}`}>
                  Contact Fleet Partner
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
