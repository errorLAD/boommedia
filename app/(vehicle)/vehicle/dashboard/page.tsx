'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Truck,
  PlusCircle,
  Megaphone,
  Clock,
  Wallet,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/common/StatsCard'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function VehicleDashboardOverview() {
  const [data, setData] = useState<any>(null)
  const [recentVehicles, setRecentVehicles] = useState<any[]>([])
  const [recentRequests, setRecentRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const [dashRes, fleetRes, reqRes] = await Promise.all([
          fetch('/api/vehicle-partner/dashboard'),
          fetch('/api/vehicle-partner/vehicles'),
          fetch('/api/vehicle-partner/requests'),
        ])

        if (dashRes.ok) {
          const dashJson = await dashRes.json()
          setData(dashJson.data || null)
        }
        if (fleetRes.ok) {
          const fleetJson = await fleetRes.json()
          setRecentVehicles((fleetJson.data || []).slice(0, 3))
        }
        if (reqRes.ok) {
          const reqJson = await reqRes.json()
          setRecentRequests((reqJson.data || []).slice(0, 3))
        }
      } catch (err) {
        console.error('Failed to load vehicle dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <p className="text-xs text-muted-foreground">Loading vehicle partner data...</p>
      </div>
    )
  }

  const d = data || {
    vehicles: 0,
    available: 0,
    activeCampaigns: 0,
    requests: 0,
    thisMonthEarnings: 0,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Vehicle Partner Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your vehicles, set advertising availability, track campaigns, and monitor your earnings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button asChild className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
            <Link href="/vehicle/vehicles/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Your Vehicle
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards — REAL DATA ONLY (No fake numbers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          label="My Vehicles"
          value={d.vehicles}
          icon={Truck}
          change="Total vehicles added"
          trend="neutral"
          gradient="from-amber-500/10 to-orange-500/10 text-amber-600"
        />
        <StatsCard
          label="Available"
          value={d.available}
          icon={CheckCircle2}
          change="Ready for advertising"
          trend="neutral"
          gradient="from-emerald-500/10 to-teal-500/10 text-emerald-600"
        />
        <StatsCard
          label="Active Campaigns"
          value={d.activeCampaigns}
          icon={Megaphone}
          change="Vehicles in use"
          trend="neutral"
          gradient="from-violet-500/10 to-indigo-500/10 text-violet-600"
        />
        <StatsCard
          label="New Requests"
          value={d.requests}
          icon={Clock}
          change="Awaiting acceptance"
          trend="neutral"
          gradient="from-blue-500/10 to-cyan-500/10 text-blue-600"
        />
        <StatsCard
          label="This Month's Earnings"
          value={formatCurrency(d.thisMonthEarnings)}
          icon={Wallet}
          change="Actual campaign revenue"
          trend="neutral"
          gradient="from-pink-500/10 to-rose-500/10 text-pink-600"
        />
      </div>

      {/* Empty State when no vehicles */}
      {d.vehicles === 0 && (
        <Card className="rounded-3xl border-2 border-dashed p-8 text-center bg-card">
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-16 w-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Truck className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">You have not added any vehicles yet</h3>
              <p className="text-xs text-muted-foreground">
                Register your Auto Rickshaw, E-Rickshaw, Bus, or Delivery Van to get matched with high-paying advertising brands in your city.
              </p>
            </div>
            <Button asChild className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-md">
              <Link href="/vehicle/vehicles/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Vehicle
              </Link>
            </Button>
          </div>
        </Card>
      )}

      {/* Overview Sections if vehicles exist */}
      {d.vehicles > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Vehicles */}
          <Card className="rounded-2xl border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Registered Fleet</CardTitle>
                <CardDescription className="text-xs">Your recently added transit vehicles</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/vehicle/vehicles">View All ({d.vehicles})</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentVehicles.map((v) => (
                <div key={v._id} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-xl bg-muted overflow-hidden relative shrink-0 flex items-center justify-center font-bold text-xs text-muted-foreground">
                      {v.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={v.images[0].url} alt={v.title} className="h-full w-full object-cover" />
                      ) : (
                        <Truck className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">{v.title}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {v.vehicleNumber || 'No plate added'} • {v.city}, {v.state}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={v.verificationStatus === 'APPROVED' || v.verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {v.verificationStatus === 'APPROVED' || v.verificationStatus === 'VERIFIED' ? 'Verified' : 'Pending Verification'}
                    </Badge>
                    <p className="text-xs font-bold mt-1 text-foreground">
                      {v.price ? `${formatCurrency(v.price)}/mo` : 'Price unlisted'}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* New Advertising Requests */}
          <Card className="rounded-2xl border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base font-bold">Advertising Requests</CardTitle>
                <CardDescription className="text-xs">Brands requesting space on your vehicles</CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/vehicle/requests">View All ({d.requests})</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {recentRequests.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground space-y-2">
                  <Clock className="h-8 w-8 mx-auto text-muted-foreground/60" />
                  <p>No new advertising requests at the moment.</p>
                  <p className="text-[11px]">When brands request your routes, they will appear here for 1-click acceptance.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map((r) => (
                    <div key={r._id} className="flex items-center justify-between p-3 rounded-xl border bg-muted/20">
                      <div>
                        <p className="text-xs font-bold text-foreground">{r.campaignName}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {r.brandName} • {r.advertisingType}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-foreground block">
                          {formatCurrency(r.partnerEarnings)}
                        </span>
                        <Button asChild size="sm" variant="outline" className="h-7 text-[11px] rounded-lg mt-1">
                          <Link href="/vehicle/requests">Review</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
