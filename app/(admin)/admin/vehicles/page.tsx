'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Car,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Eye,
  Trash2,
  Loader2,
  MapPin,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminVehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [verificationFilter, setVerificationFilter] = useState('ALL')

  // Reject modal state
  const [vehicleToReject, setVehicleToReject] = useState<any | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [rejecting, setRejecting] = useState(false)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (typeFilter !== 'ALL') params.append('vehicleType', typeFilter)
      if (verificationFilter !== 'ALL') params.append('verificationStatus', verificationFilter)

      const res = await fetch(`/api/admin/vehicles?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setVehicles(json.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load vehicles')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [typeFilter, verificationFilter, search])

  const handleApprove = async (vehicle: any) => {
    try {
      const res = await fetch(`/api/admin/vehicles/${vehicle._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE' }),
      })
      if (res.ok) {
        toast.success(`Vehicle "${vehicle.title || vehicle.registrationNumber}" approved!`)
        fetchVehicles()
      } else {
        toast.error('Failed to approve vehicle')
      }
    } catch (err) {
      toast.error('Error approving vehicle')
    }
  }

  const handleConfirmReject = async () => {
    if (!vehicleToReject || !rejectionReason.trim()) {
      toast.error('Please specify a rejection reason')
      return
    }

    try {
      setRejecting(true)
      const res = await fetch(`/api/admin/vehicles/${vehicleToReject._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT',
          rejectionReason: rejectionReason.trim(),
        }),
      })

      if (res.ok) {
        toast.success('Vehicle marked as rejected with feedback')
        setVehicleToReject(null)
        setRejectionReason('')
        fetchVehicles()
      } else {
        toast.error('Failed to reject vehicle')
      }
    } catch (err) {
      toast.error('Error rejecting vehicle')
    } finally {
      setRejecting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Vehicle Fleet Inventory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review, approve, or reject auto-rickshaws, e-rickshaws, buses, and commercial ad inventory.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, registration number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Vehicle Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="AUTO_RICKSHAW">Auto Rickshaw</SelectItem>
              <SelectItem value="E_RICKSHAW">E-Rickshaw</SelectItem>
              <SelectItem value="BUS">Bus</SelectItem>
              <SelectItem value="CAB">Cab / Taxi</SelectItem>
              <SelectItem value="TRUCK">Truck / Tempo</SelectItem>
            </SelectContent>
          </Select>

          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending Review</SelectItem>
              <SelectItem value="VERIFIED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Vehicles Table */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle & Details</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Location & Routes</TableHead>
              <TableHead>Monthly Rate</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Admin Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading vehicles...
                </TableCell>
              </TableRow>
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-muted-foreground">
                  No vehicles found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((v) => (
                <TableRow key={v._id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">
                        {v.title || v.registrationNumber}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {v.registrationNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                      {v.vehicleType?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {v.partnerId?.name || 'Partner'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div>{v.city}, {v.state}</div>
                    {v.routes?.[0]?.name && (
                      <div className="text-[10px] text-muted-foreground/80 truncate max-w-[140px]">
                        Route: {v.routes[0].name}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(v.pricing?.monthlyRate || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        v.verificationStatus === 'VERIFIED'
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : v.verificationStatus === 'REJECTED'
                          ? 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                          : 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                      }`}
                    >
                      {v.verificationStatus || 'PENDING'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] text-muted-foreground capitalize">
                      {v.availabilityStatus || 'Available'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button asChild size="sm" variant="ghost" className="h-8 px-2 rounded-lg text-xs">
                        <Link href={`/admin/vehicles/${v._id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Link>
                      </Button>
                      {v.verificationStatus !== 'VERIFIED' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleApprove(v)}
                          className="h-8 px-2 rounded-lg text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                      )}
                      {v.verificationStatus !== 'REJECTED' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setVehicleToReject(v)
                            setRejectionReason('')
                          }}
                          className="h-8 px-2 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Rejection Reason Modal */}
      <Dialog open={!!vehicleToReject} onOpenChange={(open) => !open && setVehicleToReject(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Vehicle Submission</DialogTitle>
            <DialogDescription className="text-xs">
              State the reason why &quot;{vehicleToReject?.title || vehicleToReject?.registrationNumber}&quot; cannot be approved. The vehicle partner will receive this feedback to resolve issues.
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              rows={3}
              required
              placeholder="e.g. Unclear photos of vehicle wrap area / Route details insufficient..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setVehicleToReject(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={rejecting || !rejectionReason.trim()}
              onClick={handleConfirmReject}
              className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              {rejecting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
