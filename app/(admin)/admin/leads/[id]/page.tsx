'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Loader2,
  Save,
  Building2,
  Mail,
  Phone,
  MapPin,
  Truck,
  Users,
  Layers,
  Calendar,
  Tag,
  MessageSquare,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

type Lead = {
  _id: string
  companyName: string
  contactPersonName: string
  email: string
  phone: string
  service: string
  city?: string
  state?: string
  vehicleTypes?: string[]
  budget?: string
  source?: string
  message: string
  status: string
  adminNotes: string
  createdAt: string
  updatedAt: string
}

const SERVICE_META: Record<string, { label: string; badge: string; icon: React.ElementType }> = {
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

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'converted', label: 'Converted' },
  { value: 'closed', label: 'Closed' },
]

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const [lead, setLead] = useState<Lead | null>(null)
  const [status, setStatus] = useState('new')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/leads/${params.id}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.data) {
          setLead(result.data)
          setStatus(result.data.status || 'new')
          setNotes(result.data.adminNotes || '')
        }
      })
      .catch((err) => toast.error('Failed to load enquiry details'))
      .finally(() => setLoading(false))
  }, [params.id])

  const save = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/leads/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error)
      setLead(result.data)
      toast.success('Inquiry details and admin notes updated.')
    } catch (error: any) {
      toast.error(error.message || 'Unable to save.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center space-y-2">
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
        <p className="text-xs text-muted-foreground">Loading inquiry details...</p>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-sm font-semibold text-foreground">Inquiry Not Found</p>
        <Button asChild variant="outline" size="sm" className="rounded-xl">
          <Link href="/admin/leads">Back to All Inquiries</Link>
        </Button>
      </div>
    )
  }

  const serv = SERVICE_META[lead.service] || SERVICE_META.both
  const ServIcon = serv.icon

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back Button */}
      <Button asChild variant="ghost" size="sm" className="rounded-xl">
        <Link href="/admin/leads">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inbound Leads
        </Link>
      </Button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{lead.companyName}</h1>
            <Badge
              variant="outline"
              className={`text-xs font-semibold py-0.5 px-2.5 rounded-lg flex items-center gap-1 ${serv.badge}`}
            >
              <ServIcon className="h-3 w-3" />
              {serv.label}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Received {formatDate(lead.createdAt)} • Source: <span className="font-medium text-foreground">{lead.source || 'Public Form'}</span>
          </p>
        </div>

        {/* Action quick contact buttons */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-xl text-xs">
            <a href={`mailto:${lead.email}`}>
              <Mail className="mr-1.5 h-3.5 w-3.5" />
              Email Contact
            </a>
          </Button>
          {lead.phone && (
            <Button asChild size="sm" variant="outline" className="rounded-xl text-xs">
              <a href={`tel:${lead.phone}`}>
                <Phone className="mr-1.5 h-3.5 w-3.5" />
                Call Lead
              </a>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Contact & Requirement Details */}
        <div className="md:col-span-7 space-y-6">
          {/* Contact Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                Contact & Enterprise Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/40 p-3">
                  <span className="text-muted-foreground block text-[11px]">Contact Person</span>
                  <span className="font-semibold text-foreground text-sm block mt-0.5">
                    {lead.contactPersonName}
                  </span>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <span className="text-muted-foreground block text-[11px]">Location</span>
                  <span className="font-semibold text-foreground text-sm block mt-0.5">
                    {lead.city ? `${lead.city}, ${lead.state || 'India'}` : 'Not Specified'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted/40 p-3">
                  <span className="text-muted-foreground block text-[11px]">Email Address</span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-semibold text-primary hover:underline block mt-0.5 truncate"
                  >
                    {lead.email}
                  </a>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <span className="text-muted-foreground block text-[11px]">Phone / Mobile</span>
                  <span className="font-semibold text-foreground block mt-0.5">
                    {lead.phone || '—'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirement & Specs Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                Submitted Requirements & Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
              {lead.vehicleTypes && lead.vehicleTypes.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Selected Vehicle Types:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.vehicleTypes.map((v, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium rounded-lg text-xs"
                      >
                        {v.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {lead.budget && (
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Target Budget:
                  </span>
                  <span className="text-sm font-bold text-foreground">{lead.budget}</span>
                </div>
              )}

              <div className="space-y-1.5 pt-2 border-t border-border/60">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                  Detailed Message / Campaign Brief:
                </span>
                <div className="p-3.5 bg-muted/30 rounded-xl whitespace-pre-line text-foreground leading-relaxed text-xs">
                  {lead.message || 'No additional campaign brief provided.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Admin Management & Notes */}
        <div className="md:col-span-5 space-y-6">
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold">Inquiry Management</CardTitle>
              <CardDescription className="text-xs">
                Update workflow lifecycle status and internal agency notes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Workflow Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border bg-background px-3 h-10 text-xs font-semibold"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Private Admin Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground block">
                  Internal Admin Notes (Private):
                </label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={6}
                  placeholder="Record customer communications, pricing negotiations, proposed creators/routes, or meeting follow-ups..."
                  className="text-xs rounded-xl"
                />
              </div>

              {/* Save Button */}
              <Button
                onClick={save}
                disabled={saving}
                className="w-full h-10 rounded-xl font-semibold text-xs"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Inquiry Updates
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
