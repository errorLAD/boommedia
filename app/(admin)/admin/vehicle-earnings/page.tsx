'use client'

import React, { useState, useEffect } from 'react'
import {
  Wallet,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminVehicleEarningsPage() {
  const [payouts, setPayouts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDisbursed, setTotalDisbursed] = useState(0)
  const [totalPending, setTotalPending] = useState(0)

  useEffect(() => {
    async function loadEarnings() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/payouts?role=VEHICLE_PARTNER')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setPayouts(json.data.payouts || [])
            setTotalDisbursed(json.data.totalPaid || 0)
            setTotalPending(json.data.totalPending || 0)
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadEarnings()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Vehicle Partner Earnings Ledger
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Historical record of vehicle ad space disbursements, gross earnings, and pending withdrawals.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground block">Total Disbursed to Fleet Partners</span>
          <span className="text-2xl font-extrabold text-emerald-600">
            {formatCurrency(totalDisbursed)}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Completed bank & UPI transfers
          </p>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card">
          <span className="text-xs text-muted-foreground block">Pending Partner Withdrawals</span>
          <span className="text-2xl font-extrabold text-amber-500">
            {formatCurrency(totalPending)}
          </span>
          <p className="text-[11px] text-muted-foreground mt-1">
            Requests awaiting disbursement
          </p>
        </Card>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Name</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Processed Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading earnings ledger...
                </TableCell>
              </TableRow>
            ) : payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground">
                  No vehicle partner earnings recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    {p.recipientId?.name || 'Partner'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.campaignId?.name || 'Vehicle Advertising Run'}
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
                          : 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                      }`}
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
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
