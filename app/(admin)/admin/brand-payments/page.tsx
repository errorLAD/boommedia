'use client'

import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminBrandPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPaid, setTotalPaid] = useState(0)
  const [pendingPayments, setPendingPayments] = useState(0)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadPayments() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== 'ALL') params.append('status', statusFilter)

        const res = await fetch(`/api/brand/payments?${params.toString()}`)
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setPayments(json.data.payments || [])
            setTotalPaid(json.data.totalPaid || 0)
            setPendingPayments(json.data.pendingPayments || 0)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPayments()
  }, [statusFilter])

  const filtered = payments.filter((p) => {
    if (!search) return true
    const term = search.toLowerCase()
    return (
      p.razorpayOrderId?.toLowerCase().includes(term) ||
      p.campaignId?.name?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Brand Escrow & Payments Ledger
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Complete ledger of inbound campaign deposits, escrow holdings, and gateway receipts across all client brands.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground block">Total Escrow Captured</span>
          <span className="text-2xl font-extrabold text-emerald-600">
            {formatCurrency(totalPaid)}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Confirmed gateway receipts
          </p>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground block">Pending Brand Outstandings</span>
          <span className="text-2xl font-extrabold text-amber-500">
            {formatCurrency(pendingPayments)}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Campaigns requiring escrow deposit
          </p>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground block">Est. Platform Fee (10%)</span>
          <span className="text-2xl font-extrabold text-primary">
            {formatCurrency(Math.round(totalPaid * 0.1))}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Earned platform facilitation revenue
          </p>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID, reference, or campaign..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="CAPTURED">Captured</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payments Table */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order / Reference</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
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
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                  No brand payments recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.razorpayOrderId || p._id}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {p.campaignId?.name || 'Campaign'}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(p.amount || 0)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-primary">
                    {formatCurrency(p.breakdown?.platformFee || Math.round((p.amount || 0) * 0.1))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        p.status === 'CAPTURED'
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : 'border-slate-500/40 text-slate-600'
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
      </Card>
    </div>
  )
}
