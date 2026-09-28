'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Car,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminVehiclePartnersPage() {
  const [partners, setPartners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)

      const res = await fetch(`/api/admin/vehicle-partners?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setPartners(json.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load vehicle partners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [statusFilter, search])

  const toggleVerification = async (partner: any) => {
    try {
      const res = await fetch('/api/admin/vehicle-partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId: partner._id, isVerified: !partner.isVerified }),
      })
      if (res.ok) {
        toast.success(`Verification status updated`)
        fetchPartners()
      }
    } catch (err) {
      toast.error('Failed to update verification')
    }
  }

  const toggleStatus = async (partner: any) => {
    try {
      const res = await fetch('/api/admin/vehicle-partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId: partner._id, isActive: !partner.isActive }),
      })
      if (res.ok) {
        toast.success(`Partner account ${partner.isActive ? 'suspended' : 'activated'}`)
        fetchPartners()
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Vehicle Partners Directory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Fleet owners, auto syndicates, and transit operators registered across cities.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by partner name, company, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Partners</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partner Name</TableHead>
              <TableHead>Company / Fleet</TableHead>
              <TableHead>Email & Mobile</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Vehicles</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading vehicle partners...
                </TableCell>
              </TableRow>
            ) : partners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-muted-foreground">
                  No vehicle partners found.
                </TableCell>
              </TableRow>
            ) : (
              partners.map((p) => (
                <TableRow key={p._id}>
                  <TableCell className="font-bold text-xs text-foreground">{p.name}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div>{p.companyName}</div>
                    <div className="text-[10px] text-muted-foreground/80">{p.businessType}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div>{p.email}</div>
                    <div className="text-[11px] text-muted-foreground/80">{p.phone || '—'}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {p.city ? `${p.city}, ${p.state}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-bold">
                      {p.fleetSize}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {p.isVerified ? (
                      <Badge className="bg-emerald-600 text-white text-[10px]">VERIFIED</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/40">
                        PENDING
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        p.isActive
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                      }`}
                    >
                      {p.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleVerification(p)}
                        className="h-8 px-2 rounded-lg text-xs"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1 text-primary" />
                        {p.isVerified ? 'Unverify' : 'Verify'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(p)}
                        className={`h-8 px-2 rounded-lg text-xs ${
                          p.isActive ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        {p.isActive ? 'Suspend' : 'Activate'}
                      </Button>
                    </div>
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
