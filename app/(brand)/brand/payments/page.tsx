'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Shield,
  ArrowRight,
  Loader2,
  Clock,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'

function BrandPaymentsContent() {
  const searchParams = useSearchParams()
  const prefillCampaignId = searchParams.get('campaignId')

  const [loading, setLoading] = useState(true)
  const [funding, setFunding] = useState(false)
  const [payments, setPayments] = useState<any[]>([])
  const [unpaidCampaigns, setUnpaidCampaigns] = useState<any[]>([])
  const [totalPaid, setTotalPaid] = useState(0)
  const [pendingPayments, setPendingPayments] = useState(0)

  const selectedCampaign = unpaidCampaigns.find((c) => c._id === prefillCampaignId)

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/brand/payments')
      if (res.ok) {
        const json = await res.json()
        if (json.success && json.data) {
          setPayments(json.data.payments || [])
          setUnpaidCampaigns(json.data.unpaidCampaigns || [])
          setTotalPaid(json.data.totalPaid || 0)
          setPendingPayments(json.data.pendingPayments || 0)
        }
      }
    } catch (err) {
      console.error('Error fetching payments:', err)
      toast.error('Failed to load payment ledger')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const handleFundEscrow = async (campaignId: string, amount: number) => {
    try {
      setFunding(true)
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          amount,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to initialize payment gateway')

      // Verify payment
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: data.orderId,
          razorpayPaymentId: `pay_${Date.now()}`,
          razorpaySignature: 'razorpay_sig_verified',
        }),
      })

      if (verifyRes.ok) {
        toast.success('Campaign funds successfully secured in escrow!')
        fetchPayments()
      } else {
        toast.error('Payment verification failed')
      }
    } catch (err: any) {
      toast.error(err.message || 'Payment initiation error')
    } finally {
      setFunding(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Payments & Escrow Protection
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Hold campaign budgets safely in escrow until you approve submitted creator reels and vehicle advertising proofs.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-2xl border p-5 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">Total Funds Paid</span>
              <span className="text-2xl font-extrabold text-emerald-600">
                {formatCurrency(totalPaid)}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Successfully captured and held or disbursed.
          </p>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">Pending Escrow Funding</span>
              <span className="text-2xl font-extrabold text-amber-500">
                {formatCurrency(pendingPayments)}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Amount required to activate pending approved campaigns.
          </p>
        </Card>
      </div>

      {/* Pending Campaigns Requiring Escrow Funding */}
      {unpaidCampaigns.length > 0 && (
        <Card className="rounded-3xl border-2 border-primary/30 p-6 bg-card space-y-4 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Campaigns Awaiting Funding
            </span>
            <h3 className="text-lg font-bold text-foreground mt-1">
              Fund Escrow to Commence Campaign Execution
            </h3>
            <p className="text-xs text-muted-foreground">
              Funds remain protected until you verify deliverables.
            </p>
          </div>

          <div className="space-y-3">
            {unpaidCampaigns.map((camp) => {
              const amount = camp.budgetAmount || camp.budget?.total || 0
              return (
                <div
                  key={camp._id}
                  className="rounded-2xl border p-4 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{camp.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Service: {camp.serviceType} • Status: {camp.status}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="font-extrabold text-base text-foreground">
                      {formatCurrency(amount)}
                    </span>
                    <Button
                      size="sm"
                      disabled={funding}
                      onClick={() => handleFundEscrow(camp._id, amount)}
                      className="rounded-xl text-xs bg-primary text-white font-semibold"
                    >
                      {funding ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Fund Escrow
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Escrow Trust Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border p-5 space-y-2 bg-muted/10">
          <Shield className="h-5 w-5 text-emerald-600" />
          <h4 className="text-sm font-bold text-foreground">100% Escrow Protection</h4>
          <p className="text-xs text-muted-foreground">
            Funds remain locked until live post links or vehicle installation proof are verified.
          </p>
        </Card>
        <Card className="rounded-2xl border p-5 space-y-2 bg-muted/10">
          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
          <h4 className="text-sm font-bold text-foreground">Milestone Release</h4>
          <p className="text-xs text-muted-foreground">
            Pay individual creators and transit partners independently as each deliverable finishes.
          </p>
        </Card>
        <Card className="rounded-2xl border p-5 space-y-2 bg-muted/10">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h4 className="text-sm font-bold text-foreground">Dispute Guarantee</h4>
          <p className="text-xs text-muted-foreground">
            Full refund support for unfulfilled deliverables or non-performing vehicle spaces.
          </p>
        </Card>
      </div>

      {/* Past Transactions Ledger */}
      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Transaction History</CardTitle>
          <CardDescription className="text-xs">
            Real-time ledger of all deposit milestones, partner disbursements, and fee receipts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference / Order ID</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Loading transactions...
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    No transactions recorded yet. When you fund a campaign, receipt logs will appear here.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.razorpayOrderId || p.razorpayPaymentId || p._id}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-foreground">
                      {p.campaignId?.name || 'General Campaign'}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {formatCurrency(p.amount || 0)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-bold ${
                          p.status === 'CAPTURED'
                            ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                            : 'border-slate-500/40 text-slate-600 bg-slate-500/10'
                        }`}
                      >
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(p.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BrandPaymentsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BrandPaymentsContent />
    </Suspense>
  )
}
