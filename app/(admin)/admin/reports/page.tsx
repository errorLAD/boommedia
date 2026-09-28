'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  Building2,
  Users,
  Truck,
  CreditCard,
  Percent,
  CheckCircle2,
  TrendingUp,
  Loader2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'

export default function AdminReportsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/reports')
        if (res.ok) {
          const json = await res.json()
          setData(json.data)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadReports()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const { brandReport, influencerReport, vehicleReport, financialReport } = data || {}

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Platform Performance & Analytics Reports
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Aggregated live operational metrics computed directly from MongoDB database collections.
        </p>
      </div>

      {/* 1. Financial Report */}
      <Card className="rounded-2xl border p-6 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-base font-bold text-foreground">Financial & Escrow Performance</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Gross Marketplace Volume</span>
            <p className="text-xl font-extrabold text-foreground mt-1">
              {formatCurrency(financialReport?.grossGMV || 0)}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Net Platform Revenue (10%)</span>
            <p className="text-xl font-extrabold text-primary mt-1">
              {formatCurrency(financialReport?.platformRevenue || 0)}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Creator Payouts</span>
            <p className="text-xl font-extrabold text-indigo-600 mt-1">
              {formatCurrency(financialReport?.creatorPayouts || 0)}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Vehicle Payouts</span>
            <p className="text-xl font-extrabold text-amber-500 mt-1">
              {formatCurrency(financialReport?.vehiclePayouts || 0)}
            </p>
          </div>
        </div>
      </Card>

      {/* 2. Brand Report */}
      <Card className="rounded-2xl border p-6 space-y-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <Building2 className="h-5 w-5 text-purple-600" />
          <h2 className="text-base font-bold text-foreground">Brand Operations Report</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Total Brands Registered</span>
            <p className="text-xl font-extrabold text-foreground mt-1">
              {brandReport?.totalBrands || 0}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Active Brands</span>
            <p className="text-xl font-extrabold text-emerald-600 mt-1">
              {brandReport?.activeBrands || 0}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Total Campaigns Created</span>
            <p className="text-xl font-extrabold text-foreground mt-1">
              {brandReport?.totalCampaigns || 0}
            </p>
          </div>
          <div className="p-4 rounded-xl border bg-muted/20">
            <span className="text-xs text-muted-foreground block">Completion Rate</span>
            <p className="text-xl font-extrabold text-primary mt-1">
              {brandReport?.campaignCompletionRate || 0}%
            </p>
          </div>
        </div>
      </Card>

      {/* 3. Creator & Vehicle Reports Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Influencer Report */}
        <Card className="rounded-2xl border p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-foreground">Creator Network Report</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border bg-muted/20">
              <span className="text-xs text-muted-foreground block">Total Creators</span>
              <p className="text-xl font-extrabold text-foreground mt-1">
                {influencerReport?.totalInfluencers || 0}
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20">
              <span className="text-xs text-muted-foreground block">Verified Creators</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                {influencerReport?.verifiedInfluencers || 0}
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl border bg-muted/10 text-xs text-muted-foreground flex justify-between">
            <span>Network Verification Rate:</span>
            <span className="font-bold text-foreground">
              {influencerReport?.verificationRate || 0}%
            </span>
          </div>
        </Card>

        {/* Vehicle Report */}
        <Card className="rounded-2xl border p-6 space-y-4 shadow-sm">
          <div className="flex items-center space-x-2">
            <Truck className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-foreground">Vehicle Fleet Report</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border bg-muted/20">
              <span className="text-xs text-muted-foreground block">Fleet Partners</span>
              <p className="text-xl font-extrabold text-foreground mt-1">
                {vehicleReport?.totalVehiclePartners || 0}
              </p>
            </div>
            <div className="p-4 rounded-xl border bg-muted/20">
              <span className="text-xs text-muted-foreground block">Verified Vehicles</span>
              <p className="text-xl font-extrabold text-emerald-600 mt-1">
                {vehicleReport?.verifiedVehicles || 0} / {vehicleReport?.totalVehicles || 0}
              </p>
            </div>
          </div>
          {vehicleReport?.vehicleTypes?.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t text-xs">
              <span className="font-bold text-foreground block">Inventory by Vehicle Type:</span>
              <div className="flex flex-wrap gap-2">
                {vehicleReport.vehicleTypes.map((vt: any) => (
                  <span key={vt.type} className="px-2 py-1 rounded-lg border bg-muted/20 text-[11px]">
                    {vt.type}: <strong className="text-foreground">{vt.count}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
