'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminInfluencerPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Confirm Paid Modal
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null)
  const [transactionRef, setTransactionRef] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchPayouts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/payouts?role=INFLUENCER')
      if (res.ok) {
        const json = await res.json()
        setPayouts(json.data?.payouts || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load creator payouts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayouts()
  }, [])

  const handleUpdateStatus = async (payoutId: string, action: string, ref = '') => {
    try {
      setSubmitting(true)
      const res = await fetch('/api/admin/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payoutId, action, transactionRef: ref }),
      })

      if (res.ok) {
        toast.success(`Payout marked as ${action}`)
        setSelectedPayout(null)
        setTransactionRef('')
        fetchPayouts()
      } else {
        toast.error('Failed to update payout')
      }
    } catch (err) {
      toast.error('Error updating payout')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Creator Payout Approvals
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review withdrawal requests from content creators and record payment confirmation reference IDs.
        </p>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator Name</TableHead>
              <TableHead>Payout Destination</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading payout requests...
                </TableCell>
              </TableRow>
            ) : payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                  No creator payout requests found.
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    <div>{p.recipientId?.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.recipientId?.email}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.upiId ? (
                      <span className="font-mono">UPI: {p.upiId}</span>
                    ) : p.bankAccount?.accountNumber ? (
                      <div>
                        <div className="font-mono">A/C: {p.bankAccount.accountNumber}</div>
                        <div className="text-[10px]">{p.bankAccount.ifscCode}</div>
                      </div>
                    ) : (
                      'Bank on file'
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(p.amount || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        p.status === 'COMPLETED'
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : p.status === 'PROCESSING'
                          ? 'border-blue-500/40 text-blue-600 bg-blue-500/10'
                          : 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(p.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {p.status !== 'COMPLETED' ? (
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(p._id, 'PROCESSING')}
                          className="h-8 px-2 rounded-lg text-xs text-blue-600"
                        >
                          Processing
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedPayout(p)
                            setTransactionRef(`TXN_${Date.now().toString().slice(-6)}`)
                          }}
                          className="h-8 px-2.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Confirm Paid
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground font-mono">
                        Ref: {p.razorpayPayoutId || 'Processed'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Confirm Paid Reference Modal */}
      <Dialog open={!!selectedPayout} onOpenChange={(open) => !open && setSelectedPayout(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Creator Disbursement</DialogTitle>
            <DialogDescription className="text-xs">
              Confirm transfer of {formatCurrency(selectedPayout?.amount || 0)} to &quot;{selectedPayout?.recipientId?.name}&quot;. Record the bank UTR or IMPS reference number.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Bank / IMPS / UPI Reference ID *</Label>
              <Input
                required
                placeholder="e.g. UTR8917264819"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                className="h-10 rounded-xl text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedPayout(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={submitting || !transactionRef.trim()}
              onClick={() => handleUpdateStatus(selectedPayout?._id, 'CONFIRM_PAID', transactionRef)}
              className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Record as Paid'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
