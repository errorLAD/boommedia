'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Wallet,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  CreditCard,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatsCard } from '@/components/common/StatsCard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function VehiclePayoutsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)

  const loadPayouts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/vehicle-partner/payouts')
      if (res.ok) {
        const json = await res.json()
        setData(json.data || null)
      }
    } catch (err) {
      console.error('Failed to load payouts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayouts()
  }, [])

  const handleWithdraw = async () => {
    const num = Number(amount)
    if (!num || num <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    if (num > (data?.availablePayout || 0)) {
      toast.error('Withdrawal amount exceeds available payout balance')
      return
    }

    try {
      setWithdrawing(true)
      const res = await fetch('/api/vehicle-partner/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: num }),
      })

      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.error || 'Payout request failed')
      }

      toast.success(json.message || 'Payout request submitted!')
      setWithdrawModalOpen(false)
      setAmount('')
      loadPayouts()
    } catch (err: any) {
      toast.error(err.message || 'Withdrawal failed')
    } finally {
      setWithdrawing(false)
    }
  }

  const available = data?.availablePayout || 0
  const pending = data?.pendingPayout || 0
  const paid = data?.paidAmount || 0
  const history = data?.history || []

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Fleet Payouts</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Request withdrawals to your bank or UPI account and track payout transaction processing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button asChild variant="outline" className="rounded-xl text-xs">
            <Link href="/vehicle/settings">
              <Settings className="mr-1.5 h-3.5 w-3.5" /> Payout Settings
            </Link>
          </Button>
          <Button
            onClick={() => setWithdrawModalOpen(true)}
            disabled={available <= 0}
            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md text-xs"
          >
            <ArrowUpRight className="mr-1.5 h-4 w-4" /> Request Payout
          </Button>
        </div>
      </div>

      {/* Payout Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Available Payout"
          value={loading ? '—' : formatCurrency(available)}
          icon={Wallet}
          change="Available to withdraw"
          trend="neutral"
          gradient="from-emerald-500/10 to-teal-500/10 text-emerald-600"
        />
        <StatsCard
          label="Pending Payout"
          value={loading ? '—' : formatCurrency(pending)}
          icon={Clock}
          change="Processing in escrow"
          trend="neutral"
          gradient="from-amber-500/10 to-orange-500/10 text-amber-600"
        />
        <StatsCard
          label="Paid Amount"
          value={loading ? '—' : formatCurrency(paid)}
          icon={CheckCircle2}
          change="Total paid to your account"
          trend="neutral"
          gradient="from-purple-500/10 to-indigo-500/10 text-purple-600"
        />
      </div>

      {/* Payout History */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold">Payout History</CardTitle>
          <CardDescription className="text-xs">
            Log of all payout requests, bank reference IDs, and clearance statuses.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-xs text-muted-foreground space-y-2">
              <Wallet className="h-8 w-8 mx-auto text-muted-foreground/50" />
              <p>No payout requests found.</p>
              <p className="text-[11px]">When you withdraw available campaign earnings, all transaction clearances will be displayed here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Transaction / Reference ID</TableHead>
                    <TableHead className="text-right">Payment Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-extrabold text-xs text-foreground">
                        {formatCurrency(p.amount)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {p.upiId ? `UPI: ${p.upiId}` : p.bankAccount?.accountNumber ? `Bank: XXXX${p.bankAccount.accountNumber.slice(-4)}` : 'Bank Transfer'}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {p.razorpayPayoutId || p.transactionId || 'Processing...'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            p.status === 'COMPLETED'
                              ? 'default'
                              : p.status === 'FAILED'
                              ? 'destructive'
                              : 'secondary'
                          }
                          className="text-[10px]"
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Request Modal */}
      <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Request Fleet Payout</DialogTitle>
            <DialogDescription className="text-xs">
              Funds will be dispatched to your saved bank account or UPI ID within 24-48 business hours.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-2xl bg-muted/40 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Available to Withdraw</span>
              <span className="font-extrabold text-foreground text-sm">
                {formatCurrency(available)}
              </span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Withdrawal Amount (₹)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 h-10 rounded-xl text-sm font-bold"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setWithdrawModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={withdrawing || !amount || Number(amount) <= 0}
              onClick={handleWithdraw}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              {withdrawing ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Confirm Withdrawal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
