'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Eye,
  RefreshCw,
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  Truck,
  Users,
  Layers,
  Calendar,
  MessageSquare,
  Tag,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

export type Lead = {
  _id: string
  companyName: string
  contactPersonName: string
  email: string
  phone: string
  service: 'influencer' | 'vehicle' | 'both'
  city?: string
  state?: string
  vehicleTypes?: string[]
  budget?: string
  source?: string
  message: string
  status: 'new' | 'contacted' | 'in-progress' | 'converted' | 'closed'
  adminNotes?: string
  createdAt: string
}

const SERVICE_LABELS: Record<string, { label: string; badge: string; icon: React.ElementType }> = {
  influencer: {
    label: 'Influencer Marketing',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200',
    icon: Users,
  },
  vehicle: {
    label: 'Vehicle Advertising',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
    icon: Truck,
  },
  both: {
    label: 'Both (360° Reach)',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200',
    icon: Layers,
  },
}

const STATUS_LABELS: Record<string, { label: string; badge: string }> = {
  new: { label: 'New', badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  contacted: { label: 'Contacted', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  'in-progress': { label: 'In Progress', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  converted: { label: 'Converted', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  closed: { label: 'Closed', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
}

export default function AdminLeadsPage({
  searchParams,
}: {
  searchParams?: { service?: string }
}) {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [service, setService] = useState(searchParams?.service || 'all')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLeads = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `/api/admin/leads?search=${encodeURIComponent(search)}&service=${service}&status=${status}`
      )
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Unable to load leads.')
      setLeads(result.data || [])
    } catch (err: any) {
      setError(err.message || 'Unable to load leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [service, status])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Inbound Leads & Public Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real inquiries submitted from the Landing Page, Vehicle Advertising, and Influencer forms.
          </p>
        </div>
        <Button
          onClick={loadLeads}
          variant="outline"
          size="sm"
          disabled={loading}
          className="rounded-xl self-start sm:self-auto"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Service Filter Tabs */}
      <div className="flex flex-wrap gap-2 pb-1">
        {[
          { key: 'all', label: 'All Inquiries' },
          { key: 'vehicle', label: 'Vehicle Advertising', icon: Truck },
          { key: 'influencer', label: 'Influencer Marketing', icon: Users },
          { key: 'both', label: 'Combined 360°', icon: Layers },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = service === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setService(tab.key)}
              className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-card border text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {Icon && <Icon className="mr-1.5 h-3.5 w-3.5" />}
              {tab.label}
            </button>
          )
        })}
      </div>

      <Card className="rounded-2xl border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold">
                {leads.length} Submission{leads.length === 1 ? '' : 's'}
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time MongoDB inquiries with contact information and requirements
              </CardDescription>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  loadLeads()
                }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search company, contact, city..."
                    className="pl-9 h-9 text-xs rounded-xl w-48 sm:w-60"
                  />
                </div>
                <Button type="submit" variant="outline" size="sm" className="h-9 rounded-xl text-xs">
                  Search
                </Button>
              </form>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="h-9 rounded-xl border bg-background px-3 text-xs font-medium"
              >
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_LABELS).map(([k, s]) => (
                  <option key={k} value={k}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {error ? (
            <div className="p-8 text-center text-xs text-destructive">{error}</div>
          ) : loading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading inbound leads...
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <MessageSquare className="h-10 w-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-semibold text-foreground">No inquiries found</p>
              <p className="text-xs text-muted-foreground">
                Inquiries submitted on public forms will appear here live.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Company & Contact</TableHead>
                    <TableHead className="text-xs font-bold">Service Requested</TableHead>
                    <TableHead className="text-xs font-bold">Location & Details</TableHead>
                    <TableHead className="text-xs font-bold">Requirement / Message</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-xs font-bold">Date</TableHead>
                    <TableHead className="text-right text-xs font-bold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const serv = SERVICE_LABELS[lead.service] || SERVICE_LABELS.both
                    const stat = STATUS_LABELS[lead.status] || STATUS_LABELS.new
                    const ServIcon = serv.icon

                    return (
                      <TableRow key={lead._id} className="hover:bg-muted/20">
                        {/* Company & Contact */}
                        <TableCell className="min-w-[200px] py-3">
                          <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                            {lead.companyName}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {lead.contactPersonName}
                          </div>
                          <div className="flex flex-wrap gap-2 text-[11px] mt-1.5">
                            <a
                              href={`mailto:${lead.email}`}
                              className="inline-flex items-center text-primary hover:underline gap-1"
                            >
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </a>
                            {lead.phone && (
                              <a
                                href={`tel:${lead.phone}`}
                                className="inline-flex items-center text-muted-foreground hover:underline gap-1"
                              >
                                <Phone className="h-3 w-3" />
                                {lead.phone}
                              </a>
                            )}
                          </div>
                        </TableCell>

                        {/* Service Requested */}
                        <TableCell className="whitespace-nowrap py-3">
                          <Badge
                            variant="outline"
                            className={`text-[11px] font-semibold py-0.5 px-2.5 rounded-lg flex items-center w-fit gap-1 ${serv.badge}`}
                          >
                            <ServIcon className="h-3 w-3" />
                            {serv.label}
                          </Badge>
                          {lead.budget && (
                            <span className="text-[10px] text-muted-foreground block mt-1">
                              Budget: <strong className="text-foreground">{lead.budget}</strong>
                            </span>
                          )}
                        </TableCell>

                        {/* Location & Details */}
                        <TableCell className="min-w-[150px] py-3 text-xs">
                          {lead.city ? (
                            <span className="inline-flex items-center gap-1 text-foreground font-medium">
                              <MapPin className="h-3.5 w-3.5 text-rose-500" />
                              {lead.city}
                              {lead.state ? `, ${lead.state}` : ''}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                          {lead.vehicleTypes && lead.vehicleTypes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {lead.vehicleTypes.map((v, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-1.5 py-0.5 bg-muted rounded-md text-foreground"
                                >
                                  {v.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                        </TableCell>

                        {/* Message / Requirement */}
                        <TableCell className="max-w-xs py-3 text-xs">
                          <p className="line-clamp-2 text-muted-foreground leading-relaxed">
                            {lead.message || 'No additional message provided.'}
                          </p>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="whitespace-nowrap py-3">
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold uppercase tracking-wider py-0.5 px-2 rounded-md ${stat.badge}`}
                          >
                            {stat.label}
                          </Badge>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="whitespace-nowrap py-3 text-xs text-muted-foreground">
                          {formatDate(lead.createdAt)}
                        </TableCell>

                        {/* Action */}
                        <TableCell className="text-right whitespace-nowrap py-3">
                          <Button asChild size="sm" variant="outline" className="h-8 rounded-xl text-xs">
                            <Link href={`/admin/leads/${lead._id}`}>
                              <Eye className="mr-1.5 h-3.5 w-3.5 text-primary" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
