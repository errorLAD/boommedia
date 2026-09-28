'use client'

import React from 'react'
import { BarChart3, TrendingUp, Users, Truck, Eye, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatsCard } from '@/components/common/StatsCard'
import { formatCurrency } from '@/lib/utils'

export default function BrandAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Campaign Performance Analytics</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Detailed metrics combining digital creator reach and physical vehicle transit impressions.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          label="Total Impressions"
          value="482.5K"
          icon={Eye}
          change="+24% vs last month"
          trend="up"
          gradient="from-purple-500/10 to-indigo-500/10 text-primary"
        />
        <StatsCard
          label="Creator Engagement Rate"
          value="4.6%"
          icon={TrendingUp}
          change="+0.8% organic"
          trend="up"
          gradient="from-indigo-500/10 to-blue-500/10 text-indigo-600"
        />
        <StatsCard
          label="Vehicle Transit Views"
          value="310.2K"
          icon={Truck}
          change="Darbhanga Fleet"
          trend="neutral"
          gradient="from-amber-500/10 to-orange-500/10 text-amber-500"
        />
        <StatsCard
          label="Cost Per Impression (CPM)"
          value="₹45.6"
          icon={BarChart3}
          change="Optimized ROI"
          trend="up"
          gradient="from-emerald-500/10 to-teal-500/10 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border p-6 space-y-4">
          <CardTitle className="text-base font-bold">Online vs Offline Reach Split</CardTitle>
          <CardDescription className="text-xs">
            Distribution of campaign exposure across digital creators vs physical vehicle branding.
          </CardDescription>
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Social Media Influencers (Reels & Posts)</span>
                <span>172.3K Views (36%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-indigo-600 w-[36%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span>Vehicle Advertising (E-Rickshaws & Autos)</span>
                <span>310.2K Views (64%)</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-amber-500 w-[64%]" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-2xl border p-6 space-y-4">
          <CardTitle className="text-base font-bold">Top Performing City Hubs</CardTitle>
          <CardDescription className="text-xs">
            Geographic impressions aggregated from creator followers and vehicle routes.
          </CardDescription>
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex justify-between p-2.5 rounded-xl border bg-muted/20">
              <span className="font-semibold text-foreground">Darbhanga (Station & Tower Chowk)</span>
              <span className="font-bold text-primary">195,000 Views</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl border bg-muted/20">
              <span className="font-semibold text-foreground">Patna (Boring Road & Kankarbagh)</span>
              <span className="font-bold text-primary">164,000 Views</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-xl border bg-muted/20">
              <span className="font-semibold text-foreground">Muzaffarpur (Motijheel Transit Corridor)</span>
              <span className="font-bold text-primary">123,500 Views</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
