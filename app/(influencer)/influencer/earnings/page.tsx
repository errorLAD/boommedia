'use client'

import React, { useState } from 'react'
import { Wallet, Clock, CheckCircle2, ArrowUpRight, Loader2, Building, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatsCard } from '@/components/common/StatsCard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export default function InfluencerEarningsPage() {
  const [availableBalance, setAvailableBalance] = useState(28500)
  const [payoutModalOpen, setPayoutModalOpen] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState('10000')
  const [payoutType, setPayoutType] = useState<'UPI' | 'BANK'>('UPI')
  const [upiId, setUpiId] = useState('creator@oksbi')
  const [bankAccount, setBankAccount] = useState({
    accountNumber: '987654321012',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Priya Sharma',
  })
  const [loading, setLoading] = useState(false)

  const handleRequestPayout = async () => {
    const amt = Number(payoutAmount)
    if (!amt || amt <= 0) {
      toast.error('Enter a valid payout amount')
      return
    }
    if (amt > availableBalance) {
      toast.error('Requested amount exceeds available balance')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amt,
          upiId: payoutType === 'UPI' ? upiId : undefined,
          bankAccount: payoutType === 'BANK' ? bankAccount : undefined,
        }),
      })

      if (res.ok) {
        setAvailableBalance((prev) => prev - amt)
        toast.success(`Withdrawal of ${formatCurrency(amt)} submitted! Funds arrive within 24h.`)
        setPayoutModalOpen(false)
      } else {
        toast.error('Payout submission failed')
      }
    } catch (err: any) {
      toast.error('Error submitting payout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Earnings & Payouts</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track your campaign revenue, pending escrow releases, and request instant bank/UPI payouts.
          </p>
        </div>

        <Button
          onClick={() => setPayoutModalOpen(true)}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md"
        >
          <ArrowUpRight className="mr-1.5 h-4 w-4" /> Request Payout
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Available for Withdrawal"
          value={formatCurrency(availableBalance)}
          icon={Wallet}
          change="Instant settlement available"
          trend="up"
          gradient="from-emerald-500/10 to-teal-500/10 text-emerald-600"
        />
        <StatsCard
          label="Pending in Escrow"
          value={formatCurrency(14000)}
          icon={Clock}
          change="Awaiting brand post review"
          trend="neutral"
          gradient="from-indigo-500/10 to-purple-500/10 text-indigo-600"
        />
        <StatsCard
          label="Lifetime Earnings"
          value={formatCurrency(42500)}
          icon={CheckCircle2}
          change="8 completed campaigns"
          trend="up"
          gradient="from-purple-500/10 to-pink-500/10 text-primary"
        />
      </div>

      {/* Recent Earnings Table */}
      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Campaign Payouts & Transaction History</CardTitle>
          <CardDescription className="text-xs">
            Direct settlements transferred to your registered bank account or UPI ID.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Deliverable</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold text-xs">Festive Handloom Showcase</TableCell>
                <TableCell className="text-xs text-muted-foreground">Instagram Reel</TableCell>
                <TableCell className="font-bold text-xs text-foreground">₹3,500</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-600 text-white text-[10px]">PAID</Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">Sep 18, 2026</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold text-xs">Mithila Saree Launch</TableCell>
                <TableCell className="text-xs text-muted-foreground">Story Set + Reel</TableCell>
                <TableCell className="font-bold text-xs text-foreground">₹5,000</TableCell>
                <TableCell>
                  <Badge className="bg-emerald-600 text-white text-[10px]">PAID</Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">Sep 12, 2026</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Dialog */}
      <Dialog open={payoutModalOpen} onOpenChange={setPayoutModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Request Payout Withdrawal</DialogTitle>
            <DialogDescription className="text-xs">
              Available balance: <span className="font-bold text-foreground">{formatCurrency(availableBalance)}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Withdrawal Amount (₹)</Label>
              <Input
                type="number"
                value={payoutAmount}
                onChange={(e) => setPayoutAmount(e.target.value)}
                className="h-10 rounded-xl text-sm font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Button
                type="button"
                variant={payoutType === 'UPI' ? 'default' : 'outline'}
                onClick={() => setPayoutType('UPI')}
                className="h-9 rounded-xl text-xs flex items-center justify-center space-x-1"
              >
                <Smartphone className="h-3.5 w-3.5 mr-1" /> UPI Transfer
              </Button>
              <Button
                type="button"
                variant={payoutType === 'BANK' ? 'default' : 'outline'}
                onClick={() => setPayoutType('BANK')}
                className="h-9 rounded-xl text-xs flex items-center justify-center space-x-1"
              >
                <Building className="h-3.5 w-3.5 mr-1" /> Bank IMPS / NEFT
              </Button>
            </div>

            {payoutType === 'UPI' ? (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">UPI ID / VPA</Label>
                <Input
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@okaxis"
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Account Number</Label>
                  <Input
                    value={bankAccount.accountNumber}
                    onChange={(e) =>
                      setBankAccount({ ...bankAccount, accountNumber: e.target.value })
                    }
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">IFSC Code</Label>
                  <Input
                    value={bankAccount.ifscCode}
                    onChange={(e) =>
                      setBankAccount({ ...bankAccount, ifscCode: e.target.value })
                    }
                    className="h-9 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPayoutModalOpen(false)} className="rounded-xl text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleRequestPayout}
              disabled={loading}
              className="rounded-xl text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : 'Confirm Withdrawal'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
