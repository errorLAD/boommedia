'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Megaphone,
  Search,
  Filter,
  Users,
  Truck,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  FileEdit,
  Loader2,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminBrandCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [serviceFilter, setServiceFilter] = useState('ALL')

  // Status Change Dialog
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNote, setAdminNote] = useState('')
  const [statusSubmitting, setStatusSubmitting] = useState(false)

  // Recommendation Dialog
  const [recCampaign, setRecCampaign] = useState<any | null>(null)
  const [recType, setRecType] = useState<'INFLUENCER' | 'VEHICLE'>('INFLUENCER')
  const [recFee, setRecFee] = useState(5000)
  const [recDeliverables, setRecDeliverables] = useState('1 Instagram Reel (30-60s) + 2 Stories with link sticker')
  const [recName, setRecName] = useState('')
  const [recCity, setRecCity] = useState('Patna')
  const [recCategory, setRecCategory] = useState('Lifestyle')
  const [recSocial, setRecSocial] = useState('')
  const [recRoute, setRecRoute] = useState('')
  const [recVehicleType, setRecVehicleType] = useState('Auto Rickshaw')
  const [recSubmitting, setRecSubmitting] = useState(false)

  const fetchCampaigns = async () => {
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
      console.error(err)
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [statusFilter, serviceFilter, search])

  const handleUpdateStatus = async () => {
    if (!selectedCampaign || !newStatus) return
    try {
      setStatusSubmitting(true)
      const res = await fetch(`/api/admin/campaigns/${selectedCampaign._id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, note: adminNote }),
      })

      if (res.ok) {
        toast.success('Campaign status updated successfully')
        setSelectedCampaign(null)
        setAdminNote('')
        fetchCampaigns()
      } else {
        toast.error('Failed to update status')
      }
    } catch (err) {
      toast.error('Error updating status')
    } finally {
      setStatusSubmitting(false)
    }
  }

  const handleCreateRecommendation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recCampaign || !recFee || !recDeliverables) return

    try {
      setRecSubmitting(true)
      const payload: any = {
        type: recType,
        proposedFee: Number(recFee),
        deliverables: recDeliverables,
      }

      if (recType === 'INFLUENCER') {
        payload.influencerDetails = {
          name: recName || 'Recommended Creator',
          city: recCity,
          category: recCategory,
          socialProfile: recSocial,
        }
      } else {
        payload.vehicleDetails = {
          vehicleType: recVehicleType,
          city: recCity,
          route: recRoute,
          price: Number(recFee),
        }
      }

      const res = await fetch(`/api/admin/campaigns/${recCampaign._id}/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success('Recommendation added! Brand can now review and approve it.')
        setRecCampaign(null)
        fetchCampaigns()
      } else {
        toast.error('Failed to add recommendation')
      }
    } catch (err) {
      toast.error('Error proposing option')
    } finally {
      setRecSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Brand Campaigns Operations
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage incoming campaign briefs, curate talent and fleet recommendations, and adjust workflow lifecycle stages.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns by name, product, or target city..."
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
            <SelectTrigger className="w-40 h-10 rounded-xl text-xs bg-card">
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
        </div>
      </div>

      {/* Campaigns Table */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Target Area</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Admin Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading campaigns...
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  No campaigns found matching selected filters.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">{c.name}</span>
                      <span className="text-[11px] text-muted-foreground">
                        {c.product || 'No product'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                      {c.serviceType || c.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        c.status === 'IN_PROGRESS' || c.status === 'PUBLISHED'
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : c.status === 'OPTIONS_READY' || c.status === 'APPROVED'
                          ? 'border-blue-500/40 text-blue-600 bg-blue-500/10'
                          : c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
                          ? 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                          : 'border-slate-500/30 text-slate-600'
                      }`}
                    >
                      {c.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(c.budgetAmount || c.budget?.total || 0)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.cities?.length ? c.cities.join(', ') : 'All India'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setRecCampaign(c)
                          setRecType(c.serviceType === 'VEHICLE' ? 'VEHICLE' : 'INFLUENCER')
                        }}
                        className="h-8 px-2 rounded-lg text-xs"
                      >
                        <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" /> Propose Option
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedCampaign(c)
                          setNewStatus(c.status)
                        }}
                        className="h-8 px-2 rounded-lg text-xs"
                      >
                        <FileEdit className="h-3.5 w-3.5 mr-1" /> Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Change Status & Admin Note Modal */}
      <Dialog open={!!selectedCampaign} onOpenChange={(open) => !open && setSelectedCampaign(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Update Campaign Lifecycle Status</DialogTitle>
            <DialogDescription className="text-xs">
              Change the active stage for &quot;{selectedCampaign?.name}&quot; and attach private internal notes.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Workflow Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="OPTIONS_READY">Options Ready (Waiting Brand Approval)</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="IN_PROGRESS">Active In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Private Admin Note (Internal Only)</Label>
              <Textarea
                rows={3}
                placeholder="Log internal details, client communications, or partner adjustments..."
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="rounded-xl text-xs resize-none"
              />
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedCampaign(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={statusSubmitting}
              onClick={handleUpdateStatus}
              className="rounded-xl text-xs bg-primary text-white font-semibold"
            >
              {statusSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Propose Recommendation Modal */}
      <Dialog open={!!recCampaign} onOpenChange={(open) => !open && setRecCampaign(null)}>
        <DialogContent className="rounded-2xl max-w-lg">
          <DialogHeader>
            <DialogTitle>Propose Talent or Fleet Option</DialogTitle>
            <DialogDescription className="text-xs">
              Add a vetted creator or vehicle ad space to &quot;{recCampaign?.name}&quot; for brand review and 1-click approval.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRecommendation} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Option Type</Label>
                <Select
                  value={recType}
                  onValueChange={(val: any) => setRecType(val)}
                >
                  <SelectTrigger className="h-10 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="INFLUENCER">Content Creator</SelectItem>
                    <SelectItem value="VEHICLE">Transit Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Proposed Fee (₹) *</Label>
                <Input
                  type="number"
                  required
                  value={recFee}
                  onChange={(e) => setRecFee(Number(e.target.value))}
                  className="h-10 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            {recType === 'INFLUENCER' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Creator Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Priya Sharma"
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">City</Label>
                  <Input
                    value={recCity}
                    onChange={(e) => setRecCity(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Niche / Category</Label>
                  <Input
                    value={recCategory}
                    onChange={(e) => setRecCategory(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Social Portfolio URL</Label>
                  <Input
                    placeholder="https://instagram.com/..."
                    value={recSocial}
                    onChange={(e) => setRecSocial(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Vehicle Type</Label>
                  <Input
                    value={recVehicleType}
                    onChange={(e) => setRecVehicleType(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Operating City</Label>
                  <Input
                    value={recCity}
                    onChange={(e) => setRecCity(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-semibold">Primary Route / Coverage Hub</Label>
                  <Input
                    placeholder="e.g. Station Road ➔ Tower Chowk ➔ Market Hub"
                    value={recRoute}
                    onChange={(e) => setRecRoute(e.target.value)}
                    className="h-10 rounded-xl text-xs"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Deliverables & Scope *</Label>
              <Textarea
                rows={2}
                required
                value={recDeliverables}
                onChange={(e) => setRecDeliverables(e.target.value)}
                className="rounded-xl text-xs resize-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setRecCampaign(null)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={recSubmitting}
                className="rounded-xl text-xs bg-primary text-white font-semibold"
              >
                {recSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Propose to Brand'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
