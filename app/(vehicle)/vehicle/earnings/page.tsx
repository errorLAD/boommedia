'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Wallet,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Loader2,
  Calendar,
  Truck,
  IndianRupee,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatsCard } from '@/components/common/StatsCard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function VehicleEarningsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEarnings() {
      try {
        setLoading(true)
        const res = await fetch('/api/vehicle-partner/earnings')
        if (res.ok) {
          const json = await res.json()
          setData(json.data || null)
        }
      } catch (err) {
        console.error('Failed to load earnings:', err)
      } finally {
        setLoading(false)
      }
    }
    loadEarnings()
  }, [])

  const m = data?.metrics || {
    totalEarnings: 0,
    thisMonth: 0,
    pendingEarnings: 0,
    paid: 0,
    availableBalance: 0,
  }

  const history = data?.history || []

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Fleet Earnings & Revenue</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real campaign financial breakdown, platform commissions, and payout ledger.
          </p>
        </div>

        <Button asChild className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
          <Link href="/vehicle/payouts">
            <ArrowUpRight className="mr-1.5 h-4 w-4" /> View Payouts
          </Link>
        </Button>
      </div>

      {/* Financial Metrics Cards — Real Data Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Earnings"
          value={loading ? '—' : formatCurrency(m.totalEarnings)}
          icon={Wallet}
          change="Lifetime platform earnings"
          trend="neutral"
          gradient="from-amber-500/10 to-orange-500/10 text-amber-600"
        />
        <StatsCard
          label="This Month"
          value={loading ? '—' : formatCurrency(m.thisMonth)}
          icon={Calendar}
          change="Earned this calendar month"
          trend="neutral"
          gradient="from-emerald-500/10 to-teal-500/10 text-emerald-600"
        />
        <StatsCard
          label="Pending Earnings"
          value={loading ? '—' : formatCurrency(m.pendingEarnings)}
          icon={Clock}
          change="Awaiting milestone / proof check"
          trend="neutral"
          gradient="from-blue-500/10 to-cyan-500/10 text-blue-600"
        />
        <StatsCard
          label="Paid"
          value={loading ? '—' : formatCurrency(m.paid)}
          icon={CheckCircle2}
          change="Dispatched to your bank / UPI"
          trend="neutral"
          gradient="from-purple-500/10 to-indigo-500/10 text-purple-600"
        />
      </div>

      {/* Earnings History Table */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-bold">Earnings History</CardTitle>
          <CardDescription className="text-xs">
            Detailed breakdown of campaign amounts, platform commissions, and your net earnings.
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
              <p>No earnings history recorded yet.</p>
              <p className="text-[11px]">When your vehicles run active advertising campaigns, each milestone and net partner payout will be logged here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Campaign Period</TableHead>
                    <TableHead>Campaign Amount</TableHead>
                    <TableHead>Platform Fee</TableHead>
                    <TableHead>Partner Earnings</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Payment Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((h: any) => (
                    <TableRow key={h._id}>
                      <TableCell className="font-semibold text-xs text-foreground">
                        {h.campaignName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{h.brandName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {h.vehicleId?.title || h.vehicleType}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(h.startDate)} - {formatDate(h.endDate)}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-foreground">
                        {formatCurrency(h.budget)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatCurrency(h.platformFee || 0)}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-emerald-600">
                        {formatCurrency(h.partnerEarnings)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={h.paymentStatus === 'PAID' ? 'default' : 'outline'}
                          className="text-[10px]"
                        >
                          {h.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {h.paymentDate ? formatDate(h.paymentDate) : 'Pending'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
