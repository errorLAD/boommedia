'use client'

import React, { useEffect, useState } from 'react'
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Truck,
  MessageSquare,
  Loader2,
  Clock,
  Eye,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function VehicleRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedReq, setSelectedReq] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionNotes, setActionNotes] = useState('')
  const [acting, setActing] = useState(false)

  const loadRequests = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/vehicle-partner/requests')
      if (res.ok) {
        const json = await res.json()
        setRequests(json.data || [])
      }
    } catch (err) {
      console.error('Failed to load requests:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleAction = async (requestId: string, action: 'ACCEPT' | 'REJECT') => {
    try {
      setActing(true)
      const res = await fetch('/api/vehicle-partner/requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId,
          action,
          notes: actionNotes,
        }),
      })

      if (res.ok) {
        toast.success(
          action === 'ACCEPT'
            ? 'Advertising request accepted! Campaign moved to Upcoming.'
            : 'Request declined.'
        )
        setDialogOpen(false)
        setSelectedReq(null)
        setActionNotes('')
        loadRequests()
      } else {
        toast.error('Action failed')
      }
    } catch (err) {
      toast.error('Server error executing request action')
    } finally {
      setActing(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Advertising Requests</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review incoming campaign booking requests from brands targeting your transit routes.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <p className="text-xs text-muted-foreground">Loading advertising requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <Card className="rounded-3xl border-2 border-dashed p-10 text-center bg-card">
          <div className="max-w-md mx-auto space-y-3">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">No Advertising Requests</h3>
            <p className="text-xs text-muted-foreground">
              When regional brands create advertising campaigns in your city and select your vehicle routes, new requests will appear here for your review and approval.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r._id} className="rounded-2xl border p-6 bg-card shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b">
                <div>
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">
                    {r.brandName}
                  </span>
                  <h3 className="text-lg font-bold text-foreground mt-0.5">{r.campaignName}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1.5">
                    <span className="flex items-center">
                      <Truck className="mr-1 h-3.5 w-3.5 text-amber-500" />
                      {r.vehicleType} ({r.requiredVehicles} vehicle{r.requiredVehicles > 1 ? 's' : ''})
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                      {r.location}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-muted-foreground block">Partner Net Earning</span>
                  <span className="text-xl font-extrabold text-foreground">
                    {formatCurrency(r.partnerEarnings)}
                  </span>
                  <Badge variant="secondary" className="mt-1 text-[10px]">
                    {r.status?.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3 rounded-xl bg-muted/30">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Advertising Space</span>
                  <span className="font-semibold text-foreground">{r.advertisingType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Campaign Dates</span>
                  <span className="font-semibold text-foreground">
                    {formatDate(r.startDate)} — {formatDate(r.endDate)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Assigned Vehicle</span>
                  <span className="font-semibold text-foreground">
                    {r.vehicleId?.title || 'Matched Fleet Unit'}
                  </span>
                </div>
              </div>

              {r.message && (
                <div className="text-xs text-muted-foreground bg-card p-3 rounded-xl border">
                  <span className="font-semibold text-foreground block mb-0.5">Brand Message:</span>
                  <p>{r.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedReq(r)
                    setDialogOpen(true)
                  }}
                  className="rounded-xl text-xs"
                >
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> View Request Details
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={acting}
                  onClick={() => handleAction(r._id, 'REJECT')}
                  className="rounded-xl text-xs"
                >
                  <XCircle className="mr-1.5 h-3.5 w-3.5" /> Reject
                </Button>
                <Button
                  size="sm"
                  disabled={acting}
                  onClick={() => handleAction(r._id, 'ACCEPT')}
                  className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm"
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Accept Request
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Details Dialog */}
      {selectedReq && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-xl rounded-3xl p-6">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Advertising Request Details</DialogTitle>
              <DialogDescription className="text-xs">
                Review complete campaign requirements before confirming acceptance.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
              <div className="p-4 rounded-2xl bg-muted/30 space-y-2">
                <span className="text-[11px] font-bold text-primary uppercase">
                  {selectedReq.brandName}
                </span>
                <h3 className="text-base font-bold text-foreground">{selectedReq.campaignName}</h3>
                <p className="text-muted-foreground">{selectedReq.message || 'No specific notes attached.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border">
                  <span className="text-muted-foreground block text-[11px]">Campaign Budget</span>
                  <span className="font-bold text-sm text-foreground">
                    {formatCurrency(selectedReq.budget)}
                  </span>
                </div>
                <div className="p-3 rounded-xl border">
                  <span className="text-muted-foreground block text-[11px]">Partner Earnings</span>
                  <span className="font-bold text-sm text-emerald-600">
                    {formatCurrency(selectedReq.partnerEarnings)}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Optional Acceptance Note / Driver Contact</label>
                <Textarea
                  rows={3}
                  placeholder="e.g. Vehicle is available immediately. Driver contact: 9876543210."
                  value={actionNotes}
                  onChange={(e) => setActionNotes(e.target.value)}
                  className="rounded-xl text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(false)}
                className="rounded-xl"
              >
                Close
              </Button>
              <Button
                size="sm"
                variant="destructive"
                disabled={acting}
                onClick={() => handleAction(selectedReq._id, 'REJECT')}
                className="rounded-xl"
              >
                Reject Request
              </Button>
              <Button
                size="sm"
                disabled={acting}
                onClick={() => handleAction(selectedReq._id, 'ACCEPT')}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Accept Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
