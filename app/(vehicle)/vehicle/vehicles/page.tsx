'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  PlusCircle,
  MapPin,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  Copy,
  PauseCircle,
  PlayCircle,
  CheckCircle2,
  Clock,
  Loader2,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export default function MyVehiclesPage() {
  const [fleet, setFleet] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const loadVehicles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/vehicle-partner/vehicles')
      if (res.ok) {
        const json = await res.json()
        setFleet(json.data || [])
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

  const handleToggleAvailability = async (v: any) => {
    const nextStatus = v.availabilityStatus === 'AVAILABLE' ? 'NOT_AVAILABLE' : 'AVAILABLE'
    const nextAvail = nextStatus === 'AVAILABLE'

    try {
      const res = await fetch(`/api/vehicle-partner/vehicles/${v._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isAvailable: nextAvail,
          availabilityStatus: nextStatus,
        }),
      })

      if (res.ok) {
        setFleet((prev) =>
          prev.map((item) =>
            item._id === v._id
              ? { ...item, isAvailable: nextAvail, availabilityStatus: nextStatus }
              : item
          )
        )
        toast.success(`Vehicle marked as ${nextStatus.replace('_', ' ')}`)
      }
    } catch (err) {
      toast.error('Failed to update availability')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/vehicle-partner/vehicles/${deleteId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setFleet((prev) => prev.filter((v) => v._id !== deleteId))
        toast.success('Vehicle removed from fleet')
      } else {
        toast.error('Failed to delete vehicle')
      }
    } catch (err) {
      toast.error('Delete request failed')
    } finally {
      setDeleting(false)
      setDeleteId(null)
    }
  }

  const handleDuplicate = async (v: any) => {
    try {
      const copyPayload = {
        ...v,
        title: `${v.title} (Copy)`,
        vehicleNumber: '',
        registrationNumber: '',
        isDraft: true,
      }
      delete copyPayload._id
      delete copyPayload.createdAt
      delete copyPayload.updatedAt

      const res = await fetch('/api/vehicle-partner/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copyPayload),
      })

      if (res.ok) {
        toast.success('Vehicle duplicated as draft!')
        loadVehicles()
      }
    } catch (err) {
      toast.error('Duplication failed')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">My Vehicles</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your registered transit vehicles, update availability, and review advertising contracts.
          </p>
        </div>

        <Button asChild className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
          <Link href="/vehicle/vehicles/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Vehicle
          </Link>
        </Button>
      </div>

      {/* Fleet Listing */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs text-muted-foreground">Loading your vehicles...</p>
        </div>
      ) : fleet.length === 0 ? (
        <Card className="rounded-3xl border-2 border-dashed p-10 text-center bg-card">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Truck className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">You have not added any vehicles yet</h3>
              <p className="text-xs text-muted-foreground">
                Start listing your autos, e-rickshaws, and commercial fleet to receive advertising proposals from regional brands.
              </p>
            </div>
            <Button asChild className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
              <Link href="/vehicle/vehicles/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Vehicle
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleet.map((v) => {
            const primaryPhoto = v.images?.find((i: any) => i.isPrimary)?.url || v.images?.[0]?.url || v.photos?.[0]?.url
            const isVerified = v.verificationStatus === 'APPROVED' || v.verificationStatus === 'VERIFIED'
            const isAvailable = v.availabilityStatus === 'AVAILABLE'

            return (
              <Card key={v._id} className="rounded-3xl border overflow-hidden bg-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  {/* Photo header */}
                  <div className="aspect-[16/10] w-full bg-muted relative overflow-hidden flex items-center justify-center">
                    {primaryPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={primaryPhoto} alt={v.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                        <Truck className="h-10 w-10 mb-1" />
                        <span className="text-[11px]">No photo uploaded</span>
                      </div>
                    )}
                    <Badge className="absolute top-3 left-3 text-[10px] bg-black/60 backdrop-blur-sm text-white border-0">
                      {v.vehicleType}
                    </Badge>
                    <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                      <Badge
                        variant={isVerified ? 'default' : 'secondary'}
                        className={`text-[10px] font-bold ${
                          isVerified ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {isVerified ? 'Verified' : 'Pending Verification'}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-foreground line-clamp-1">{v.title}</h3>
                        <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                          <MapPin className="mr-1 h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{v.city}, {v.state}</span>
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl w-44">
                          <DropdownMenuItem asChild>
                            <Link href={`/vehicle/vehicles/new?edit=${v._id}`} className="cursor-pointer text-xs">
                              <Edit className="mr-2 h-3.5 w-3.5" /> Edit Vehicle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleAvailability(v)} className="cursor-pointer text-xs">
                            {isAvailable ? (
                              <>
                                <PauseCircle className="mr-2 h-3.5 w-3.5 text-amber-500" /> Pause Ads
                              </>
                            ) : (
                              <>
                                <PlayCircle className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Make Available
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(v)} className="cursor-pointer text-xs">
                            <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteId(v._id)}
                            className="cursor-pointer text-xs text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete Vehicle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/30 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Monthly Price</span>
                        <span className="font-extrabold text-foreground">
                          {v.price ? `${formatCurrency(v.price)}/mo` : 'Price unlisted'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Availability</span>
                        <span className={`font-bold ${isAvailable ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                          {v.availabilityStatus?.replace('_', ' ') || 'Available'}
                        </span>
                      </div>
                    </div>

                    {/* Transit Corridor */}
                    {v.routes?.[0] && (
                      <div className="text-[11px] text-muted-foreground border-t pt-2.5">
                        <span className="font-semibold text-foreground">Route: </span>
                        <span>
                          {v.routes[0].startingPoint || v.routes[0].from} → {v.routes[0].endPoint || v.routes[0].to}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card footer */}
                <div className="px-5 pb-5 pt-0 flex items-center justify-between border-t border-border/50 pt-3">
                  <Badge variant="outline" className="text-[10px]">
                    Campaign: {v.campaignStatus?.replace('_', ' ') || 'Available'}
                  </Badge>
                  <Button
                    size="sm"
                    variant={isAvailable ? 'outline' : 'secondary'}
                    onClick={() => handleToggleAvailability(v)}
                    className="h-8 rounded-xl text-xs"
                  >
                    {isAvailable ? 'Pause' : 'Activate'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Confirmation Dialog before Deletion */}
      <Dialog open={Boolean(deleteId)} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
        <DialogContent className="rounded-3xl max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" /> Delete Vehicle?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to remove this vehicle from your fleet? Any active advertising proposals will be cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteId(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-xl text-xs bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete Vehicle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
