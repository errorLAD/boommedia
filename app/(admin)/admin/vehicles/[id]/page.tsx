'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Car,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Loader2,
  DollarSign,
  Route,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminVehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`)
      if (res.ok) {
        const json = await res.json()
        setVehicle(json.data)
      } else {
        toast.error('Vehicle not found')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error fetching vehicle')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (vehicleId) fetchVehicle()
  }, [vehicleId])

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      })
      if (res.ok) {
        toast.success('Vehicle verified and approved')
        fetchVehicle()
      }
    } catch (err) {
      toast.error('Error approving vehicle')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-16 space-y-3">
        <h3 className="font-bold text-lg">Vehicle record not found</h3>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin/vehicles">Back to Inventory</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Button asChild variant="ghost" size="sm" className="rounded-xl">
            <Link href="/admin/vehicles">
              <ArrowLeft className="h-4 w-4 mr-1" /> All Vehicles
            </Link>
          </Button>
          <div className="h-4 w-[1px] bg-border" />
          <span className="text-xs text-muted-foreground font-semibold">Vehicle Specs</span>
        </div>

        {vehicle.verificationStatus !== 'VERIFIED' && (
          <Button
            size="sm"
            onClick={handleApprove}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve Vehicle
          </Button>
        )}
      </div>

      <Card className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs uppercase font-bold">
                {vehicle.vehicleType?.replace('_', ' ')}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs uppercase font-bold ${
                  vehicle.verificationStatus === 'VERIFIED'
                    ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                    : vehicle.verificationStatus === 'REJECTED'
                    ? 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                    : 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                }`}
              >
                {vehicle.verificationStatus || 'PENDING'}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {vehicle.title || vehicle.registrationNumber}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center font-mono">
                Reg: {vehicle.registrationNumber}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-primary" /> {vehicle.city}, {vehicle.state}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" /> Added {formatDate(vehicle.createdAt)}
              </span>
            </div>
          </div>

          <div className="text-right border-l pl-6 hidden sm:block">
            <span className="text-xs text-muted-foreground block">Monthly Rate</span>
            <span className="text-2xl font-extrabold text-foreground">
              {formatCurrency(vehicle.pricing?.monthlyRate || 0)}
            </span>
          </div>
        </div>

        {/* Rejection Reason if any */}
        {vehicle.rejectionReason && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs">
            <span className="font-bold text-rose-700 block">Rejection Feedback:</span>
            <p className="text-rose-600 mt-1">{vehicle.rejectionReason}</p>
          </div>
        )}

        {/* Vehicle Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 text-xs">
          <div className="space-y-2">
            <h4 className="font-bold text-foreground">Vehicle Partner Details</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Name: {vehicle.partnerId?.name || 'Partner'}</div>
              <div>Email: {vehicle.partnerId?.email || '—'}</div>
              <div>Phone: {vehicle.partnerId?.phone || '—'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-foreground">Advertising Formats & Areas</h4>
            <div className="space-y-1 text-muted-foreground">
              <div>Available Formats: {vehicle.advertisingFormats?.join(', ') || 'Back Panel'}</div>
              <div>Operating Days: {vehicle.operatingDays?.join(', ') || 'All Days'}</div>
              <div>Hours: {vehicle.operatingHours?.start || '06:00'} - {vehicle.operatingHours?.end || '22:00'}</div>
            </div>
          </div>
        </div>

        {/* Routes */}
        {vehicle.routes && vehicle.routes.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-bold text-xs text-foreground flex items-center">
              <Route className="h-3.5 w-3.5 mr-1 text-primary" /> Registered Routes
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {vehicle.routes.map((r: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border bg-muted/20">
                  <span className="font-bold text-foreground block">{r.name}</span>
                  <span className="text-muted-foreground">{r.startPoint} ➔ {r.endPoint}</span>
                  {r.dailyKilometers && (
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Avg Daily Run: {r.dailyKilometers} km
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo Gallery */}
        {vehicle.images && vehicle.images.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-bold text-xs text-foreground">Uploaded Photos</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {vehicle.images.map((img: any, i: number) => (
                <div key={i} className="rounded-xl border overflow-hidden aspect-video bg-muted/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url || img}
                    alt={`Vehicle slot ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
