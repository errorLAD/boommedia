'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckSquare,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminInfluencerApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('type', 'INFLUENCER')
      if (statusFilter !== 'ALL') params.append('status', statusFilter)

      const res = await fetch(`/api/admin/applications?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setApplications(json.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [statusFilter])

  const handleUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: id, status }),
      })
      if (res.ok) {
        toast.success(`Application marked as ${status}`)
        fetchApplications()
      }
    } catch (err) {
      toast.error('Error updating application')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Creator Campaign Applications
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review proposals, proposed fees, and pitch messages submitted by content creators.
        </p>
      </div>

      <div className="flex justify-end">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACCEPTED">Accepted</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator Name</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Pitch Message</TableHead>
              <TableHead>Proposed Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading applications...
                </TableCell>
              </TableRow>
            ) : applications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-xs text-muted-foreground">
                  No creator applications found.
                </TableCell>
              </TableRow>
            ) : (
              applications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell className="font-bold text-xs text-foreground">
                    <div>{app.applicantId?.name || 'Creator'}</div>
                    <div className="text-[10px] text-muted-foreground">{app.applicantId?.email}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {app.campaignId?.name || 'Campaign'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {app.message || 'No pitch message'}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(app.proposedPrice || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        app.status === 'ACCEPTED'
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : app.status === 'REJECTED'
                          ? 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                          : 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                      }`}
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(app.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {app.status === 'PENDING' ? (
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdate(app._id, 'ACCEPTED')}
                          className="h-8 px-2 text-xs text-emerald-600 hover:text-emerald-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdate(app._id, 'REJECTED')}
                          className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">{app.status}</span>
                    )}
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
