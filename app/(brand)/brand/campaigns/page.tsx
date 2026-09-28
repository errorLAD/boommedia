'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  PlusCircle,
  Search,
  Megaphone,
  Filter,
  Users,
  Truck,
  Layers,
  LayoutGrid,
  List,
  Calendar,
  IndianRupee,
  MapPin,
  Clock,
  ArrowRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'

function BrandCampaignsList() {
  const searchParams = useSearchParams()
  const initialService = searchParams.get('service') || 'ALL'

  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [serviceFilter, setServiceFilter] = useState(initialService.toUpperCase())
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')

  useEffect(() => {
    const serviceFromUrl = searchParams.get('service')
    if (serviceFromUrl) {
      setServiceFilter(serviceFromUrl.toUpperCase())
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (statusFilter !== 'ALL') params.append('status', statusFilter)
        if (serviceFilter !== 'ALL') params.append('service', serviceFilter)
        if (search) params.append('search', search)

        const res = await fetch(`/api/brand/campaigns?${params.toString()}`)
        if (res.ok) {
          const json = await res.json()
          setCampaigns(json.data || [])
        }
      } catch (err) {
        console.error('Fetch campaigns error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCampaigns()
  }, [statusFilter, serviceFilter, search])

  const getServiceBadge = (type: string) => {
    if (type === 'INFLUENCER') {
      return (
        <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 text-[10px] font-bold">
          <Users className="mr-1 h-3 w-3" /> Influencer
        </Badge>
      )
    }
    if (type === 'VEHICLE') {
      return (
        <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 text-[10px] font-bold">
          <Truck className="mr-1 h-3 w-3" /> Vehicle Ads
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 text-[10px] font-bold">
        <Layers className="mr-1 h-3 w-3" /> Combined
      </Badge>
    )
  }

  const getStatusBadge = (st: string) => {
    let classes = 'border-slate-500/30 text-slate-600 bg-slate-500/10'
    if (st === 'IN_PROGRESS' || st === 'PUBLISHED') classes = 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
    else if (st === 'APPROVED' || st === 'OPTIONS_READY') classes = 'border-blue-500/40 text-blue-600 bg-blue-500/10'
    else if (st === 'SUBMITTED' || st === 'UNDER_REVIEW') classes = 'border-amber-500/40 text-amber-600 bg-amber-500/10'
    else if (st === 'DRAFT') classes = 'border-gray-500/30 text-muted-foreground bg-muted/20'

    return (
      <Badge variant="outline" className={`text-[10px] uppercase font-bold ${classes}`}>
        {st.replace('_', ' ')}
      </Badge>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            {serviceFilter === 'INFLUENCER'
              ? 'Influencer Campaigns'
              : serviceFilter === 'VEHICLE'
              ? 'Vehicle Advertising Campaigns'
              : 'All Brand Campaigns'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track briefs, review agency recommendations, and monitor real-time execution across all marketing channels.
          </p>
        </div>

        <Button asChild className="rounded-xl bg-primary text-white font-semibold shadow-sm">
          <Link href="/brand/campaigns/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {/* Filter and View Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns by name, city, or goal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Services</SelectItem>
              <SelectItem value="INFLUENCER">Influencer</SelectItem>
              <SelectItem value="VEHICLE">Vehicle Ads</SelectItem>
              <SelectItem value="BOTH">Combined</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="SUBMITTED">Submitted</SelectItem>
              <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
              <SelectItem value="OPTIONS_READY">Options Ready</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Card / Table Toggle */}
          <div className="hidden sm:flex items-center border rounded-xl p-1 bg-card">
            <Button
              size="sm"
              variant={viewMode === 'card' ? 'secondary' : 'ghost'}
              className="h-8 px-2.5 rounded-lg"
              onClick={() => setViewMode('card')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              className="h-8 px-2.5 rounded-lg"
              onClick={() => setViewMode('table')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Campaigns Listing */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : campaigns.length === 0 ? (
        <Card className="rounded-3xl border p-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Megaphone className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No campaigns found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No campaigns match your current filters. Create a new campaign to begin collaborating with creators and transit fleets.
            </p>
            <Button asChild size="sm" className="rounded-xl mt-2">
              <Link href="/brand/campaigns/create">Create Campaign ➔</Link>
            </Button>
          </div>
        </Card>
      ) : viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <Card key={c._id} className="rounded-2xl border hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {getServiceBadge(c.serviceType || c.type)}
                  {getStatusBadge(c.status)}
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground line-clamp-1">
                    {c.name}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {c.goal || c.objective || c.description || 'Campaign strategy brief'}
                  </p>
                </div>

                <div className="pt-2 border-t space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <IndianRupee className="mr-1 h-3.5 w-3.5 text-foreground" />
                      Budget:
                    </span>
                    <span className="font-bold text-foreground">
                      {formatCurrency(c.budgetAmount || c.budget?.total || 0)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                      Locations:
                    </span>
                    <span className="truncate max-w-[150px]">
                      {c.cities?.length ? c.cities.join(', ') : 'All India'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      Created:
                    </span>
                    <span>{formatDate(c.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t bg-muted/10 flex items-center justify-end">
                <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs font-semibold">
                  <Link href={`/brand/campaigns/${c._id}`}>
                    Manage Campaign <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-2xl border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Target Locations</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-bold text-xs text-foreground">{c.name}</TableCell>
                  <TableCell>{getServiceBadge(c.serviceType || c.type)}</TableCell>
                  <TableCell>{getStatusBadge(c.status)}</TableCell>
                  <TableCell className="font-semibold text-xs text-foreground">
                    {formatCurrency(c.budgetAmount || c.budget?.total || 0)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.cities?.join(', ') || 'All India'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="ghost" className="text-xs font-semibold">
                      <Link href={`/brand/campaigns/${c._id}`}>Manage</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}

export default function BrandCampaignsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading campaigns...</div>}>
      <BrandCampaignsList />
    </Suspense>
  )
}
