'use client'

import React, { useState, useEffect } from 'react'
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Wrench,
  XCircle,
  Truck,
  Loader2,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

export default function FleetAvailabilityPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)

  const loadVehicles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/vehicle-partner/vehicles')
      if (res.ok) {
        const json = await res.json()
        setVehicles(json.data || [])
      }
    } catch (err) {
      console.error('Failed to load fleet:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  const handleUpdate = async (v: any, newStatus: string, from?: string, until?: string) => {
    try {
      setSavingId(v._id)
      const res = await fetch(`/api/vehicle-partner/vehicles/${v._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availabilityStatus: newStatus,
          availableFrom: from || v.availableFrom,
          availableUntil: until || v.availableUntil,
          isAvailable: newStatus === 'AVAILABLE',
        }),
      })

      if (res.ok) {
        toast.success(`Availability updated for ${v.title}`)
        setVehicles((prev) =>
          prev.map((item) =>
            item._id === v._id
              ? {
                  ...item,
                  availabilityStatus: newStatus,
                  availableFrom: from || item.availableFrom,
                  availableUntil: until || item.availableUntil,
                  isAvailable: newStatus === 'AVAILABLE',
                }
              : item
          )
        )
      } else {
        toast.error('Failed to update availability')
      }
    } catch (err) {
      toast.error('Error saving availability')
    } finally {
      setSavingId(null)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Fleet Advertising Availability</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Control when your vehicles are active and available for advertising contracts, or mark maintenance periods.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs text-muted-foreground">Loading fleet availability...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <Card className="rounded-3xl border-2 border-dashed p-10 text-center bg-card">
          <div className="max-w-md mx-auto space-y-3">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground/60" />
            <h3 className="text-base font-bold text-foreground">No registered vehicles</h3>
            <p className="text-xs text-muted-foreground">
              Add your vehicles first to configure advertising availability dates and schedules.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {vehicles.map((v) => {
            const status = v.availabilityStatus || 'AVAILABLE'
            const isSaving = savingId === v._id

            return (
              <Card key={v._id} className="rounded-2xl border p-5 bg-card space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                      <Truck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{v.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {v.vehicleType} • {v.vehicleNumber || 'No plate'} • {v.city}, {v.state}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      className={`text-[10px] ${
                        status === 'AVAILABLE'
                          ? 'bg-emerald-600 text-white'
                          : status === 'BOOKED'
                          ? 'bg-blue-600 text-white'
                          : status === 'MAINTENANCE'
                          ? 'bg-amber-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Availability Status</Label>
                    <Select
                      value={status}
                      onValueChange={(val) => handleUpdate(v, val)}
                      disabled={isSaving}
                    >
                      <SelectTrigger className="h-9 rounded-xl text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="AVAILABLE" className="text-xs">Available for Advertising</SelectItem>
                        <SelectItem value="BOOKED" className="text-xs">Booked with Campaign</SelectItem>
                        <SelectItem value="MAINTENANCE" className="text-xs">Under Maintenance</SelectItem>
                        <SelectItem value="NOT_AVAILABLE" className="text-xs">Not Available / Off Road</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Available From</Label>
                    <Input
                      type="date"
                      defaultValue={v.availableFrom ? new Date(v.availableFrom).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleUpdate(v, status, e.target.value, undefined)}
                      disabled={isSaving}
                      className="h-9 rounded-xl text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Available Until</Label>
                    <Input
                      type="date"
                      defaultValue={v.availableUntil ? new Date(v.availableUntil).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleUpdate(v, status, undefined, e.target.value)}
                      disabled={isSaving}
                      className="h-9 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {v.campaignStatus === 'ACTIVE' && (
                  <div className="text-[11px] text-amber-700 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 flex items-center space-x-2">
                    <Clock className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>This vehicle is currently running an active advertising campaign. Date changes will reflect in milestone scheduling.</span>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
