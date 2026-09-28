'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Truck,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminVehicleCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true)
        const res = await fetch('/api/brand/campaigns?service=VEHICLE')
        if (res.ok) {
          const json = await res.json()
          setCampaigns(json.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadCampaigns()
  }, [])

  const filtered = campaigns.filter((c) =>
    search ? c.name?.toLowerCase().includes(search.toLowerCase()) : true
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Transit Advertising Campaigns
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Active and scheduled vehicle advertising runs, fleet assignments, route coverage, and wrap proofs.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search transit campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 rounded-xl text-xs bg-card"
        />
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Target Fleets</TableHead>
              <TableHead>Operating Cities</TableHead>
              <TableHead>Vehicle Pool</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading transit campaigns...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  No transit advertising campaigns found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-bold text-xs text-foreground">{c.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.vehicleRequirements?.vehicleTypes?.join(', ') || 'Auto / E-Rickshaw'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.cities?.join(', ') || 'All Locations'}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(c.budget?.vehicle || c.budgetAmount || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost" className="text-xs rounded-xl">
                      <Link href={`/admin/brand-campaigns`}>Manage</Link>
                    </Button>
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
