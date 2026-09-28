'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
  Megaphone,
  CreditCard,
  PlusCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  Truck,
  Layers,
  ArrowRight,
  FileEdit,
  AlertCircle,
  HelpCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatsCard } from '@/components/common/StatsCard'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DashboardData {
  activeCampaigns: number
  upcomingCampaigns: number
  pendingRequests: number
  completedCampaigns: number
  pendingPayments: number
  totalBudget: number
  recentCampaigns: any[]
  pendingRecommendationsCount: number
  latestDraft: any | null
}

export default function BrandDashboardOverview() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashboardData>({
    activeCampaigns: 0,
    upcomingCampaigns: 0,
    pendingRequests: 0,
    completedCampaigns: 0,
    pendingPayments: 0,
    totalBudget: 0,
    recentCampaigns: [],
    pendingRecommendationsCount: 0,
    latestDraft: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch('/api/brand/dashboard')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data) {
            setData(json.data)
          }
        }
      } catch (err) {
        console.error('Failed to load brand dashboard:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  return (
    <div className="space-y-8">
      {/* Top Banner & Greetings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Welcome back, {session?.user?.name || 'Brand Partner'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your influencer collaborations, transit vehicle advertising, and combined campaigns in real-time.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button asChild className="rounded-xl bg-primary text-white font-semibold shadow-sm hover:opacity-90">
            <Link href="/brand/campaigns/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Resume Draft Banner */}
      {data.latestDraft && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <FileEdit className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>Unsaved Campaign Draft Detected</span>
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-amber-600 border-amber-500/30">
                  Draft
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                You have an unfinished campaign draft &quot;{data.latestDraft.name}&quot;. Pick up right where you left off.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs shrink-0 font-medium">
            <Link href={`/brand/campaigns/create?draftId=${data.latestDraft._id}`}>
              Resume Draft ➔
            </Link>
          </Button>
        </div>
      )}

      {/* Agency Recommendations Ready Banner */}
      {data.pendingRecommendationsCount > 0 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground flex items-center gap-2">
                <span>Agency Recommendations Ready for Review</span>
                <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                  {data.pendingRecommendationsCount} Pending
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our talent & transit strategists curated creator and vehicle options matching your campaign requirements.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs shrink-0 font-medium">
            <Link href="/brand/recommendations">
              Review Options ➔
            </Link>
          </Button>
        </div>
      )}

      {/* Real KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          label="Active Campaigns"
          value={data.activeCampaigns}
          icon={Megaphone}
          change="Currently running"
          trend="neutral"
          gradient="from-purple-500/10 to-indigo-500/10 text-purple-600"
        />
        <StatsCard
          label="Upcoming"
          value={data.upcomingCampaigns}
          icon={Clock}
          change="Approved & ready"
          trend="neutral"
          gradient="from-blue-500/10 to-cyan-500/10 text-blue-600"
        />
        <StatsCard
          label="Pending Requests"
          value={data.pendingRequests}
          icon={AlertCircle}
          change="Awaiting agency review"
          trend="neutral"
          gradient="from-amber-500/10 to-orange-500/10 text-amber-500"
        />
        <StatsCard
          label="Completed"
          value={data.completedCampaigns}
          icon={CheckCircle2}
          change="All-time completed"
          trend="neutral"
          gradient="from-emerald-500/10 to-teal-500/10 text-emerald-600"
        />
        <StatsCard
          label="Pending Payments"
          value={formatCurrency(data.pendingPayments)}
          icon={CreditCard}
          change="Due for active work"
          trend="neutral"
          gradient="from-rose-500/10 to-red-500/10 text-rose-600"
        />
      </div>

      {/* Quick Launch Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl border p-5 bg-card hover:border-purple-500/40 transition-all shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Influencer Marketing</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Curated Instagram & YouTube creators, reels, product placements, and full deliverables tracking.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
            <Link href="/brand/campaigns/create?service=INFLUENCER">Launch Influencer Campaign ➔</Link>
          </Button>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card hover:border-amber-500/40 transition-all shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Vehicle Transit Ads</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            High-impact brand wraps on e-rickshaws, autos, and commercial vehicles with verified route coverage.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
            <Link href="/brand/campaigns/create?service=VEHICLE">Launch Vehicle Campaign ➔</Link>
          </Button>
        </Card>

        <Card className="rounded-2xl border p-5 bg-card hover:border-emerald-500/40 transition-all shadow-sm">
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Combined 360° Blitz</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Synchronize digital creator virality with street-level transit presence for maximum regional brand impact.
          </p>
          <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-semibold">
            <Link href="/brand/campaigns/create?service=BOTH">Launch Combined Campaign ➔</Link>
          </Button>
        </Card>
      </div>

      {/* Recent Campaigns Table */}
      <Card className="rounded-2xl border">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div>
            <CardTitle className="text-base font-bold">Recent Campaigns</CardTitle>
            <p className="text-xs text-muted-foreground">Monitor status, budget allocation, and recommendations.</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs">
            <Link href="/brand/campaigns">View All ({data.recentCampaigns.length})</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                    Loading campaigns...
                  </TableCell>
                </TableRow>
              ) : data.recentCampaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <Megaphone className="h-10 w-10 text-muted-foreground/40 mb-3" />
                      <h4 className="text-sm font-semibold text-foreground">No campaigns yet</h4>
                      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                        You have not launched any campaigns yet. Create your first campaign to collaborate with creators or transit fleets.
                      </p>
                      <Button asChild size="sm" className="rounded-xl">
                        <Link href="/brand/campaigns/create">Create Your First Campaign</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.recentCampaigns.map((c) => (
                  <TableRow key={c._id}>
                    <TableCell className="font-semibold text-foreground text-xs">{c.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                        {c.serviceType || c.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-semibold ${
                          c.status === 'IN_PROGRESS' || c.status === 'PUBLISHED'
                            ? 'border-emerald-500/50 text-emerald-600 bg-emerald-500/10'
                            : c.status === 'OPTIONS_READY' || c.status === 'APPROVED'
                            ? 'border-blue-500/50 text-blue-600 bg-blue-500/10'
                            : c.status === 'DRAFT'
                            ? 'border-amber-500/50 text-amber-600 bg-amber-500/10'
                            : ''
                        }`}
                      >
                        {c.status?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {formatCurrency(c.budgetAmount || c.budget?.total || 0)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm" className="text-xs font-semibold">
                        <Link href={`/brand/campaigns/${c._id}`}>Manage ➔</Link>
                      </Button>
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
