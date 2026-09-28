'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  Truck,
  Car,
  Megaphone,
  Inbox,
  ShieldAlert,
  CreditCard,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Loader2,
  Activity,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/common/StatsCard'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOverview() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/overview')
        if (res.ok) {
          const json = await res.json()
          if (json.data) setStats(json.data)
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err)
      } finally {
        setLoading(false)
      }
    }
    loadOverview()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Platform Administration Center
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Unified control panel overseeing Brands, Vehicle Fleets, Creators, Campaigns, Escrow Funds, and System Activity.
        </p>
      </div>

      {/* 9 Core KPI Metrics (Zero Fake Data) */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Platform Operations & Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <StatsCard
            label="1. Total Brands"
            value={loading ? '—' : stats?.totalBrands ?? 0}
            icon={Building2}
            change="Registered enterprises"
            trend="neutral"
            gradient="from-purple-500/10 to-indigo-500/10 text-purple-600"
            href="/admin/brands"
          />
          <StatsCard
            label="2. Total Influencers"
            value={loading ? '—' : stats?.totalInfluencers ?? 0}
            icon={Users}
            change="Registered creators"
            trend="neutral"
            gradient="from-indigo-500/10 to-blue-500/10 text-indigo-600"
            href="/admin/influencers"
          />
          <StatsCard
            label="3. Vehicle Partners"
            value={loading ? '—' : stats?.totalVehiclePartners ?? 0}
            icon={Truck}
            change="Fleet owners"
            trend="neutral"
            gradient="from-amber-500/10 to-orange-500/10 text-amber-500"
            href="/admin/vehicle-partners"
          />
          <StatsCard
            label="4. Total Vehicles"
            value={loading ? '—' : stats?.totalVehicles ?? 0}
            icon={Car}
            change="Autos, E-Rickshaws & Buses"
            trend="neutral"
            gradient="from-emerald-500/10 to-teal-500/10 text-emerald-600"
            href="/admin/vehicles"
          />
          <StatsCard
            label="5. Active Campaigns"
            value={loading ? '—' : stats?.activeCampaigns ?? 0}
            icon={Megaphone}
            change="Currently in market"
            trend="neutral"
            gradient="from-blue-500/10 to-cyan-500/10 text-blue-600"
            href="/admin/brand-campaigns"
          />
          <StatsCard
            label="6. New Enquiries"
            value={loading ? '—' : stats?.newEnquiries ?? 0}
            icon={Inbox}
            change="Inbound lead forms"
            trend="neutral"
            gradient="from-violet-500/10 to-purple-500/10 text-violet-600"
            href="/admin/leads"
          />
          <StatsCard
            label="7. Pending Approvals"
            value={loading ? '—' : stats?.pendingApprovals ?? 0}
            icon={ShieldAlert}
            change="Vehicles & Creator verification"
            trend="neutral"
            gradient="from-rose-500/10 to-red-500/10 text-rose-600"
            href="/admin/vehicles"
          />
          <StatsCard
            label="8. Pending Payments"
            value={loading ? '—' : formatCurrency(stats?.pendingPayments || 0)}
            icon={CreditCard}
            change="Due from brands"
            trend="neutral"
            gradient="from-amber-500/10 to-yellow-500/10 text-amber-600"
            href="/admin/brand-payments"
          />
          <StatsCard
            label="9. Pending Payouts"
            value={loading ? '—' : stats?.pendingPayouts ?? 0}
            icon={ArrowUpRight}
            change="Withdrawal requests"
            trend="neutral"
            gradient="from-teal-500/10 to-emerald-500/10 text-teal-600"
            href="/admin/vehicle-payouts"
          />
        </div>
      </div>

      {/* Quick Section Navigation Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-2xl border p-5 bg-card hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Brand Operations</span>
              <Building2 className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-bold text-base text-foreground">Brand Management</h3>
            <p className="text-xs text-muted-foreground">
              Oversee {stats?.totalBrands ?? 0} brands, inspect campaigns, review brief documents, and manage client invoicing.
            </p>
          </div>
          <div className="pt-4 border-t mt-4 flex items-center justify-between">
            <Button asChild size="sm" variant="ghost" className="text-xs font-semibold">
              <Link href="/admin/brands">Manage Brands ➔</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs rounded-xl">
              <Link href="/admin/brand-campaigns">Campaigns</Link>
            </Button>
          </div>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card hover:border-amber-500/40 transition-all flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Transit Ads</span>
              <Car className="h-4 w-4 text-amber-500" />
            </div>
            <h3 className="font-bold text-base text-foreground">Vehicle Management</h3>
            <p className="text-xs text-muted-foreground">
              Review {stats?.pendingVehicleApprovals ?? 0} pending vehicles, route approvals, wrap proofs, and fleet partner payouts.
            </p>
          </div>
          <div className="pt-4 border-t mt-4 flex items-center justify-between">
            <Button asChild size="sm" variant="ghost" className="text-xs font-semibold">
              <Link href="/admin/vehicles">Vehicle Inventory ➔</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs rounded-xl">
              <Link href="/admin/vehicle-payouts">Payouts</Link>
            </Button>
          </div>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Talent Agency</span>
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <h3 className="font-bold text-base text-foreground">Creator Management</h3>
            <p className="text-xs text-muted-foreground">
              Manage {stats?.totalInfluencers ?? 0} registered creators, review applications, and curate campaign talent rosters.
            </p>
          </div>
          <div className="pt-4 border-t mt-4 flex items-center justify-between">
            <Button asChild size="sm" variant="ghost" className="text-xs font-semibold">
              <Link href="/admin/influencers">Creator Directory ➔</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="text-xs rounded-xl">
              <Link href="/admin/influencer-payouts">Payouts</Link>
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity Feed (Live MongoDB Audit Log) */}
      <Card className="rounded-2xl border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center">
              <Activity className="mr-2 h-4 w-4 text-primary" /> Live Platform Activity Feed
            </CardTitle>
            <CardDescription className="text-xs">
              System events, partner submissions, verification updates, and escrow movements.
            </CardDescription>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/admin/activity">View Full Audit Log ➔</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              Loading recent activities...
            </div>
          ) : !stats?.recentActivities || stats.recentActivities.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No activity logged yet. System actions and user submissions will appear here live.
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivities.map((act: any) => (
                <div
                  key={act._id}
                  className="rounded-xl border p-3 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                        {act.userRole || 'SYSTEM'}
                      </Badge>
                      <span className="font-semibold text-foreground">{act.userName}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground font-mono text-[11px]">{act.action}</span>
                    </div>
                    <p className="text-muted-foreground">{act.details}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {formatDate(act.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
