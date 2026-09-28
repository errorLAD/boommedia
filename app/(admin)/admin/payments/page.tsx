'use client'

import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  ArrowUpRight,
  Shield,
  Percent,
  CheckCircle2,
  Clock,
  Loader2,
  Building2,
  Users,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminPaymentsPage() {
  const [report, setReport] = useState<any>(null)
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const [repRes, poRes] = await Promise.all([
          fetch('/api/admin/reports'),
          fetch('/api/admin/payouts'),
        ])

        if (repRes.ok) {
          const repJson = await repRes.json()
          setReport(repJson.data?.financialReport || null)
        }
        if (poRes.ok) {
          const poJson = await poRes.json()
          setPayouts(poJson.data?.payouts || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Platform Central Payments & Payouts Ledger
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Real-time oversight of inbound brand deposits, earned platform commission, and partner payout outflows.
        </p>
      </div>

      {/* Financial Overview Metrics (100% Real DB Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Total Platform GMV</span>
          <p className="text-2xl font-extrabold text-foreground mt-1">
            {loading ? '—' : formatCurrency(report?.grossGMV || 0)}
          </p>
          <span className="text-[11px] text-muted-foreground">Captured brand deposits</span>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Earned Commission</span>
          <p className="text-2xl font-extrabold text-primary mt-1">
            {loading ? '—' : formatCurrency(report?.platformRevenue || 0)}
          </p>
          <span className="text-[11px] text-muted-foreground">Platform facilitation fees</span>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Creator Disbursed</span>
          <p className="text-2xl font-extrabold text-indigo-600 mt-1">
            {loading ? '—' : formatCurrency(report?.creatorPayouts || 0)}
          </p>
          <span className="text-[11px] text-muted-foreground">Paid to influencers</span>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground font-semibold uppercase">Vehicle Disbursed</span>
          <p className="text-2xl font-extrabold text-amber-500 mt-1">
            {loading ? '—' : formatCurrency(report?.vehiclePayouts || 0)}
          </p>
          <span className="text-[11px] text-muted-foreground">Paid to fleet partners</span>
        </Card>
      </div>

      {/* Recent Disbursal Records */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/10 font-bold text-sm text-foreground">
          Recent Partner Disbursements
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recipient</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reference / UTR</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading payment ledger...
                </TableCell>
              </TableRow>
            ) : payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                  No disbursement records logged yet.
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {p.recipientId?.name || 'Partner'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                      {p.recipientRole}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(p.amount || 0)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.razorpayPayoutId || '—'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        p.status === 'COMPLETED'
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right">
                    {formatDate(p.processedAt || p.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
