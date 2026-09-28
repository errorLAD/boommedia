'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Truck,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Building2,
  User,
  Users,
  Calendar,
  DollarSign,
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  SlidersHorizontal,
  ChevronRight,
  Plus,
  Edit,
  ExternalLink,
  Copy,
  Save,
  MessageSquare,
  BadgeAlert,
  HelpCircle,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { VehicleCategoryItem } from '@/lib/types/vehicleAds'

const STATUS_COLORS: Record<string, string> = {
  New: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  Contacted: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
  'Requirement Confirmed': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
  'Proposal Sent': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  Negotiation: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  Approved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  'Campaign Active': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  Completed: 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-400 border-neutral-500/20',
  Cancelled: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
}

const PRIORITY_COLORS: Record<string, string> = {
  Low: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
  Medium: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  High: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
  Urgent: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 font-bold',
}

const ALL_STATUSES = [
  'New',
  'Contacted',
  'Requirement Confirmed',
  'Proposal Sent',
  'Negotiation',
  'Approved',
  'Campaign Active',
  'Completed',
  'Cancelled',
]

export default function AdminVehicleEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [categories, setCategories] = useState<VehicleCategoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  // Filters & Pagination
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [priorityFilter, setPriorityFilter] = useState('ALL')
  const [vehicleFilter, setVehicleFilter] = useState('ALL')
  const [cityFilter, setCityFilter] = useState('ALL')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)

  // Detail Modal State
  const [selectedEnquiry, setSelectedEnquiry] = useState<any>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newAdminNote, setNewAdminNote] = useState('')
  const [editingStatus, setEditingStatus] = useState('')
  const [editingPriority, setEditingPriority] = useState('')
  const [editingAssignedAdmin, setEditingAssignedAdmin] = useState('')
  const [confirmStatusChange, setConfirmStatusChange] = useState<string | null>(null)
  const [admins, setAdmins] = useState<any[]>([])

  // Category Edit Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [isSavingCategory, setIsSavingCategory] = useState(false)

  // Fetch Enquiries
  const fetchEnquiries = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '15',
        search,
        status: statusFilter,
        priority: priorityFilter,
        vehicleType: vehicleFilter,
        city: cityFilter,
        startDate: startDateFilter,
        endDate: endDateFilter,
      })

      const res = await fetch(`/api/admin/vehicle-enquiries?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setEnquiries(json.data || [])
        setTotalPages(json.pagination?.totalPages || 1)
        setTotalCount(json.pagination?.total || 0)
      } else {
        toast.error('Failed to load enquiries')
      }
    } catch (err) {
      console.error('Fetch enquiries error:', err)
      toast.error('Network error loading enquiries')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, priorityFilter, vehicleFilter, cityFilter, startDateFilter, endDateFilter])

  // Fetch Analytics (real DB numbers only)
  const fetchAnalytics = useCallback(async () => {
    try {
      setAnalyticsLoading(true)
      const res = await fetch('/api/admin/vehicle-enquiries/analytics')
      if (res.ok) {
        const json = await res.json()
        setAnalytics(json.data || null)
      }
    } catch (err) {
      console.error('Fetch analytics error:', err)
    } finally {
      setAnalyticsLoading(false)
    }
  }, [])

  // Fetch Categories for admin manager
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/vehicle-categories')
      if (res.ok) {
        const json = await res.json()
        setCategories(json.data || [])
      }
    } catch (err) {
      console.error('Fetch categories error:', err)
    }
  }, [])

  // Fetch Admin Users for assignment
  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users?role=ADMIN')
      if (res.ok) {
        const json = await res.json()
        setAdmins(json.data || [])
      }
    } catch (err) {
      console.error('Fetch admins error:', err)
    }
  }, [])

  useEffect(() => {
    fetchEnquiries()
  }, [fetchEnquiries])

  useEffect(() => {
    fetchAnalytics()
    fetchCategories()
    fetchAdmins()
  }, [fetchAnalytics, fetchCategories, fetchAdmins])

  // Open Enquiry Detail
  const handleOpenDetail = (enquiry: any) => {
    setSelectedEnquiry(enquiry)
    setEditingStatus(enquiry.status)
    setEditingPriority(enquiry.priority)
    setEditingAssignedAdmin(enquiry.assignedAdmin?._id || enquiry.assignedAdmin || '')
    setNewAdminNote('')
    setConfirmStatusChange(null)
    setIsDetailOpen(true)
  }

  // Update Enquiry
  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return

    setIsUpdating(true)
    try {
      const payload: any = {
        status: editingStatus,
        priority: editingPriority,
        assignedAdmin: editingAssignedAdmin || null,
      }

      if (newAdminNote.trim()) {
        payload.newAdminNote = newAdminNote.trim()
      }

      const res = await fetch(`/api/admin/vehicle-enquiries/${selectedEnquiry._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const json = await res.json()
      if (res.ok && json.success) {
        toast.success('Enquiry updated successfully')
        setSelectedEnquiry(json.data)
        setNewAdminNote('')
        setConfirmStatusChange(null)
        // Refresh listing & analytics
        fetchEnquiries()
        fetchAnalytics()
      } else {
        toast.error(json.error || 'Failed to update enquiry')
      }
    } catch (err) {
      console.error('Save error:', err)
      toast.error('Network error updating enquiry')
    } finally {
      setIsUpdating(false)
    }
  }

  // Save Category Edit
  const handleSaveCategory = async () => {
    if (!editingCategory) return
    setIsSavingCategory(true)
    try {
      const res = await fetch('/api/admin/vehicle-categories', {
        method: editingCategory._id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingCategory),
      })
      const json = await res.json()
      if (res.ok && json.success) {
        toast.success('Vehicle category saved successfully')
        setCategoryModalOpen(false)
        fetchCategories()
      } else {
        toast.error(json.error || 'Failed to save category')
      }
    } catch (err) {
      console.error('Save category error:', err)
      toast.error('Network error saving category')
    } finally {
      setIsSavingCategory(false)
    }
  }

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center">
            <Truck className="mr-3 h-7 w-7 text-amber-500" />
            Vehicle Advertising Enquiries
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Track, qualify, and manage incoming transit advertising campaigns and fleet requirements.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchEnquiries()
              fetchAnalytics()
            }}
            className="rounded-xl text-xs h-9"
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button asChild size="sm" className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs h-9">
            <Link href="/vehicle-ads" target="_blank">
              <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
              View Public Page
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── REAL ANALYTICS CARDS (ZERO FAKE DATA) ─────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="rounded-2xl border bg-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-muted-foreground uppercase">Total Enquiries</span>
          <p className="text-2xl font-extrabold text-foreground">
            {analyticsLoading ? '...' : analytics?.totalEnquiries ?? 0}
          </p>
          <span className="text-[10px] text-muted-foreground block">Lifetime requests</span>
        </Card>

        <Card className="rounded-2xl border bg-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-blue-600 uppercase">New Enquiries</span>
          <p className="text-2xl font-extrabold text-blue-600">
            {analyticsLoading ? '...' : analytics?.newEnquiries ?? 0}
          </p>
          <span className="text-[10px] text-muted-foreground block">Needs review</span>
        </Card>

        <Card className="rounded-2xl border bg-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase">Contacted</span>
          <p className="text-2xl font-extrabold text-indigo-600">
            {analyticsLoading ? '...' : analytics?.contacted ?? 0}
          </p>
          <span className="text-[10px] text-muted-foreground block">In discussion</span>
        </Card>

        <Card className="rounded-2xl border bg-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase">Active Campaigns</span>
          <p className="text-2xl font-extrabold text-emerald-600">
            {analyticsLoading ? '...' : analytics?.activeCampaigns ?? 0}
          </p>
          <span className="text-[10px] text-muted-foreground block">Running on streets</span>
        </Card>

        <Card className="rounded-2xl border bg-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-amber-600 uppercase">This Month</span>
          <p className="text-2xl font-extrabold text-amber-600">
            {analyticsLoading ? '...' : analytics?.enquiriesThisMonth ?? 0}
          </p>
          <span className="text-[10px] text-muted-foreground block">Current month leads</span>
        </Card>

        <Card className="rounded-2xl border bg-card p-4 space-y-1">
          <span className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 uppercase">Top Category</span>
          <p className="text-sm font-extrabold text-foreground truncate mt-1">
            {analyticsLoading
              ? '...'
              : analytics?.mostRequestedVehicle?.type?.replace('_', ' ') || 'None yet'}
          </p>
          <span className="text-[10px] text-muted-foreground block">
            {analytics?.mostRequestedVehicle ? `${analytics.mostRequestedVehicle.count} requests` : 'No data'}
          </span>
        </Card>
      </div>

      {/* ─── TABS: ENQUIRIES VS CATEGORIES MANAGEMENT ──────────────────────────────── */}
      <Tabs defaultValue="enquiries" className="space-y-6">
        <TabsList className="rounded-2xl p-1 bg-muted/60">
          <TabsTrigger value="enquiries" className="rounded-xl text-xs font-bold px-4 py-2">
            Incoming Enquiries ({totalCount})
          </TabsTrigger>
          <TabsTrigger value="categories" className="rounded-xl text-xs font-bold px-4 py-2">
            Vehicle Categories & Settings ({categories.length})
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: ENQUIRIES LIST ──────────────────────────────────────────────── */}
<TabsContent value="enquiries" className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="rounded-2xl border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">
                    Search & Filters
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden rounded-xl text-xs h-8"
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>

              <div className={`space-y-4 ${showFilters ? '' : 'hidden md:block'}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Search */}
                  <div className="lg:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search company, contact, email, phone, city..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                      }}
                      className="rounded-xl pl-9 text-xs h-9"
                    />
                  </div>

                  {/* Status Filter */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value)
                        setPage(1)
                      }}
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                    >
                      <option value="ALL">All Statuses</option>
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <select
                      value={priorityFilter}
                      onChange={(e) => {
                        setPriorityFilter(e.target.value)
                        setPage(1)
                      }}
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                    >
                      <option value="ALL">All Priorities</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Reset Filter Button */}
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearch('')
                        setStatusFilter('ALL')
                        setPriorityFilter('ALL')
                        setVehicleFilter('ALL')
                        setCityFilter('ALL')
                        setStartDateFilter('')
                        setEndDateFilter('')
                        setPage(1)
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground h-9 w-full rounded-xl"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>

                {/* Secondary Filters: Vehicle Type, City, Date Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-border/60">
                  <div>
                    <select
                      value={vehicleFilter}
                      onChange={(e) => {
                        setVehicleFilter(e.target.value)
                        setPage(1)
                      }}
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                    >
                      <option value="ALL">All Vehicle Types</option>
                      {categories.map((cat) => (
                        <option key={cat.key} value={cat.key}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={cityFilter}
                      onChange={(e) => {
                        setCityFilter(e.target.value)
                        setPage(1)
                      }}
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                    >
                      <option value="ALL">All Cities</option>
                      {['Darbhanga', 'Patna', 'Muzaffarpur', 'Madhubani', 'Gaya', 'Bhagalpur', 'Purnia', 'Samastipur'].map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Input
                      type="date"
                      placeholder="Start Date"
                      value={startDateFilter}
                      onChange={(e) => {
                        setStartDateFilter(e.target.value)
                        setPage(1)
                      }}
                      className="rounded-xl text-xs h-9"
                    />
                  </div>

                  <div>
                    <Input
                      type="date"
                      placeholder="End Date"
                      value={endDateFilter}
                      onChange={(e) => {
                        setEndDateFilter(e.target.value)
                        setPage(1)
                      }}
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 text-xs">
                      <TableHead className="font-bold">Company / Brand</TableHead>
                      <TableHead className="font-bold">Contact Person</TableHead>
                      <TableHead className="font-bold">City</TableHead>
                      <TableHead className="font-bold">Vehicle Categories</TableHead>
                      <TableHead className="font-bold">Format & Units</TableHead>
                      <TableHead className="font-bold">Priority</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                      <TableHead className="text-right font-bold">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-xs text-muted-foreground">
                          Loading vehicle enquiries...
                        </TableCell>
                      </TableRow>
                    ) : enquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-16 space-y-2">
                          <Truck className="h-8 w-8 text-muted-foreground/50 mx-auto" />
                          <p className="text-sm font-semibold text-foreground">
                            No vehicle advertising enquiries yet.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            When brands submit campaign requirements from the public Vehicle Ads page, they will appear here.
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      enquiries.map((enq) => (
                        <TableRow key={enq._id} className="hover:bg-muted/30 transition-colors">
                      {/* Company */}
                      <TableCell className="font-bold text-xs text-foreground">
                        {enq.companyName}
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell className="text-xs space-y-0.5">
                        <span className="font-semibold text-foreground block">{enq.contactPersonName}</span>
                        <span className="text-[11px] text-muted-foreground block">{enq.mobile}</span>
                      </TableCell>

                      {/* City */}
                      <TableCell className="text-xs text-foreground font-medium">
                        {enq.city}
                        {enq.state ? <span className="text-[10px] text-muted-foreground block">{enq.state}</span> : null}
                      </TableCell>

                      {/* Vehicle Types */}
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {(enq.vehicleTypes || []).map((t: string) => (
                            <Badge
                              key={t}
                              variant="secondary"
                              className="text-[9px] font-semibold uppercase px-1.5 py-0"
                            >
                              {t.replace('_', ' ')}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      {/* Format & Count */}
                      <TableCell className="text-xs">
                        <span className="font-medium text-foreground block line-clamp-1">
                          {enq.advertisingFormat || 'Standard'}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          Vehicles: {enq.vehicleCount || 'Flexible'}
                        </span>
                      </TableCell>

                      {/* Priority */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold border-none ${
                            PRIORITY_COLORS[enq.priority] || PRIORITY_COLORS.Medium
                          }`}
                        >
                          {enq.priority || 'Medium'}
                        </Badge>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            STATUS_COLORS[enq.status] || STATUS_COLORS.New
                          }`}
                        >
                          {enq.status || 'New'}
                        </Badge>
                      </TableCell>

                      {/* Created Date */}
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(enq.createdAt, 'short')}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenDetail(enq)}
                          className="rounded-xl text-xs h-8 px-3"
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
            </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-muted-foreground">
                Showing page {page} of {totalPages} ({totalCount} total)
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-xl text-xs h-8"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-xl text-xs h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 2: CATEGORIES SETUP ───────────────────────────────────────────── */}
        <TabsContent value="categories" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Dynamic Vehicle Categories</h3>
              <p className="text-xs text-muted-foreground">
                Edit advertising locations, images, and presentation for all 8 categories without code changes.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => {
                setEditingCategory({
                  name: '',
                  key: '',
                  tagline: '',
                  shortDescription: '',
                  imageUrl: '',
                  advertisingLocations: ['Side Panels', 'Rear Panel'],
                  exampleUseCase: '',
                  ctaLabel: 'Request Ads →',
                  displayOrder: categories.length + 1,
                  isActive: true,
                })
                setCategoryModalOpen(true)
              }}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs h-8"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Card key={cat.key} className="rounded-2xl border overflow-hidden bg-card flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[16/10] w-full bg-muted">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={cat.isActive ? 'bg-emerald-600 text-white text-[10px]' : 'bg-rose-600 text-white text-[10px]'}>
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-foreground">{cat.name}</h4>
                      <span className="text-[10px] font-mono text-muted-foreground">#{cat.displayOrder}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{cat.shortDescription}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {(cat.advertisingLocations || []).map((l: string, i: number) => (
                        <span key={i} className="text-[9px] bg-muted px-1.5 py-0.5 rounded">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(cat)
                      setCategoryModalOpen(true)
                    }}
                    className="w-full rounded-xl text-xs h-8"
                  >
                    <Edit className="mr-1.5 h-3.5 w-3.5" />
                    Edit Category
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── ENQUIRY DETAIL & MANAGEMENT MODAL ────────────────────────────────────── */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
          {selectedEnquiry && (
            <div className="space-y-6">
              <DialogHeader>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      Enquiry Ref: {selectedEnquiry._id}
                    </span>
                    <DialogTitle className="text-2xl font-black text-foreground mt-0.5">
                      {selectedEnquiry.companyName}
                    </DialogTitle>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        STATUS_COLORS[selectedEnquiry.status] || STATUS_COLORS.New
                      }`}
                    >
                      {selectedEnquiry.status}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs font-semibold ${
                        PRIORITY_COLORS[selectedEnquiry.priority] || PRIORITY_COLORS.Medium
                      }`}
                    >
                      {selectedEnquiry.priority}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              {/* Quick Contact Bar */}
              <div className="rounded-2xl border bg-muted/30 p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-muted-foreground block">Contact Person:</span>
                  <span className="text-sm font-bold text-foreground block">
                    {selectedEnquiry.contactPersonName}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="rounded-xl text-xs h-8"
                  >
                    <a href={`tel:${selectedEnquiry.mobile}`}>
                      <Phone className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                      Call {selectedEnquiry.mobile}
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="rounded-xl text-xs h-8"
                  >
                    <a href={`mailto:${selectedEnquiry.email}`}>
                      <Mail className="mr-1.5 h-3.5 w-3.5 text-blue-600" />
                      Email
                    </a>
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      handleCopy(
                        `${selectedEnquiry.companyName} | ${selectedEnquiry.contactPersonName} | ${selectedEnquiry.mobile} | ${selectedEnquiry.email}`,
                        'Contact info'
                      )
                    }
                    className="rounded-xl text-xs h-8"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Campaign Specifications Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="rounded-xl border p-3 space-y-1">
                  <span className="text-muted-foreground font-medium block">Target City</span>
                  <span className="font-bold text-foreground block">{selectedEnquiry.city}</span>
                  {selectedEnquiry.state && (
                    <span className="text-[10px] text-muted-foreground block">{selectedEnquiry.state}</span>
                  )}
                  {selectedEnquiry.area && (
                    <span className="text-[10px] text-muted-foreground block">Area: {selectedEnquiry.area}</span>
                  )}
                </div>

                <div className="rounded-xl border p-3 space-y-1">
                  <span className="text-muted-foreground font-medium block">Vehicle Categories</span>
                  <div className="flex flex-wrap gap-1">
                    {(selectedEnquiry.vehicleTypes || []).map((t: string) => (
                      <Badge key={t} variant="secondary" className="text-[9px] uppercase font-bold">
                        {t.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border p-3 space-y-1">
                  <span className="text-muted-foreground font-medium block">Ad Format & Units</span>
                  <span className="font-bold text-foreground block">{selectedEnquiry.advertisingFormat}</span>
                  <span className="text-[10px] text-muted-foreground block">
                    Vehicles: {selectedEnquiry.vehicleCount}
                  </span>
                </div>

                <div className="rounded-xl border p-3 space-y-1">
                  <span className="text-muted-foreground font-medium block">Budget</span>
                  <span className="font-bold text-foreground block">
                    {selectedEnquiry.budget || 'Not specified'}
                  </span>
                </div>

                <div className="rounded-xl border p-3 space-y-1">
                  <span className="text-muted-foreground font-medium block">Campaign Timeline</span>
                  <span className="font-bold text-foreground block">
                    {selectedEnquiry.campaignStartDate
                      ? formatDate(selectedEnquiry.campaignStartDate, 'short')
                      : 'Flexible'}{' '}
                    –{' '}
                    {selectedEnquiry.campaignEndDate
                      ? formatDate(selectedEnquiry.campaignEndDate, 'short')
                      : 'Flexible'}
                  </span>
                </div>

                <div className="rounded-xl border p-3 space-y-1">
                  <span className="text-muted-foreground font-medium block">Enquiry Submitted</span>
                  <span className="font-bold text-foreground block">
                    {formatDate(selectedEnquiry.createdAt, 'long')}
                  </span>
                </div>
              </div>

              {/* Requirement Description */}
              <div className="rounded-2xl border p-4 space-y-2 bg-muted/20">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                  Campaign Requirement:
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedEnquiry.campaignDescription}
                </p>
              </div>

              {/* Status & Priority Management Form */}
              <div className="rounded-2xl border p-5 space-y-4 bg-card">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Manage Status & Priority
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Campaign Status</Label>
                    <select
                      value={editingStatus}
                      onChange={(e) => {
                        const next = e.target.value
                        if (next === 'Approved' || next === 'Cancelled') {
                          setConfirmStatusChange(next)
                        } else {
                          setConfirmStatusChange(null)
                        }
                        setEditingStatus(next)
                      }}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Priority Level</Label>
                    <select
                      value={editingPriority}
                      onChange={(e) => setEditingPriority(e.target.value)}
                      className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Assign Admin */}
                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <Label className="text-xs font-semibold flex items-center">
                    <Users className="mr-1.5 h-3.5 w-3.5" />
                    Assign To Admin
                  </Label>
                  <select
                    value={editingAssignedAdmin}
                    onChange={(e) => setEditingAssignedAdmin(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                  >
                    <option value="">Unassigned</option>
                    {admins.map((admin: any) => (
                      <option key={admin._id} value={admin._id}>
                        {admin.name || admin.email} ({admin.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Confirmation alert for critical transitions */}
                {confirmStatusChange && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      You are changing status to <strong>{confirmStatusChange}</strong>. Please confirm before saving.
                    </span>
                  </div>
                )}
              </div>

              {/* Internal Admin Notes Thread */}
              <div className="rounded-2xl border p-5 space-y-4 bg-card">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4 text-amber-500" />
                    Internal Admin Notes ({selectedEnquiry.adminNotes?.length || 0})
                  </h4>
                </div>

                {/* Existing Notes */}
                {selectedEnquiry.adminNotes && selectedEnquiry.adminNotes.length > 0 ? (
                  <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                    {selectedEnquiry.adminNotes.map((note: any, idx: number) => (
                      <div key={idx} className="rounded-xl border bg-muted/40 p-3 space-y-1 text-xs">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="font-semibold text-foreground">{note.authorName || 'Admin'}</span>
                          <span>{formatDate(note.createdAt, 'short')}</span>
                        </div>
                        <p className="text-foreground leading-relaxed">{note.note}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No internal notes yet.</p>
                )}

                {/* Add New Note */}
                <div className="space-y-2 pt-2 border-t">
                  <Label className="text-xs font-semibold">Add Internal Note</Label>
                  <Textarea
                    placeholder="e.g. Spoke with Rahul. Target launch date confirmed for Oct 15 in Darbhanga market..."
                    rows={2}
                    value={newAdminNote}
                    onChange={(e) => setNewAdminNote(e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsDetailOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
                <Button
                  disabled={isUpdating}
                  onClick={handleSaveEnquiry}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs"
                >
                  {isUpdating ? 'Saving Changes...' : 'Save Updates'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── CATEGORY EDIT / CREATE MODAL ─────────────────────────────────────────── */}
      <Dialog open={categoryModalOpen} onOpenChange={setCategoryModalOpen}>
        <DialogContent className="max-w-xl rounded-3xl p-6">
          {editingCategory && (
            <div className="space-y-5">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {editingCategory._id ? `Edit ${editingCategory.name}` : 'New Vehicle Category'}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Update category display name, image, and ad locations visible on the public page.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Category Name</Label>
                  <Input
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="e.g. Auto Rickshaw"
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Tagline</Label>
                  <Input
                    value={editingCategory.tagline || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, tagline: e.target.value })}
                    placeholder="e.g. High-frequency street-level mobility"
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Short Description</Label>
                  <Textarea
                    rows={2}
                    value={editingCategory.shortDescription}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, shortDescription: e.target.value })
                    }
                    className="rounded-xl text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Representative Image URL</Label>
                  <Input
                    value={editingCategory.imageUrl}
                    onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-semibold">Advertising Locations (comma separated)</Label>
                  <Input
                    value={
                      Array.isArray(editingCategory.advertisingLocations)
                        ? editingCategory.advertisingLocations.join(', ')
                        : editingCategory.advertisingLocations || ''
                    }
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        advertisingLocations: e.target.value.split(',').map((s) => s.trim()),
                      })
                    }
                    placeholder="Rear Hood, Side Panels, Roof"
                    className="rounded-xl text-xs h-9"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Display Order</Label>
                    <Input
                      type="number"
                      value={editingCategory.displayOrder || 1}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, displayOrder: parseInt(e.target.value) })
                      }
                      className="rounded-xl text-xs h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold">Status</Label>
                    <select
                      value={editingCategory.isActive ? 'true' : 'false'}
                      onChange={(e) =>
                        setEditingCategory({ ...editingCategory, isActive: e.target.value === 'true' })
                      }
                      className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none"
                    >
                      <option value="true">Active (Visible)</option>
                      <option value="false">Disabled (Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCategoryModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  disabled={isSavingCategory}
                  onClick={handleSaveCategory}
                  className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                >
                  {isSavingCategory ? 'Saving...' : 'Save Category'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
