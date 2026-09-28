'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Building2,
  Search,
  Filter,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Trash2,
  Loader2,
  ExternalLink,
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
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Delete modal state
  const [brandToDelete, setBrandToDelete] = useState<any | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)

      const res = await fetch(`/api/admin/brands?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setBrands(json.data || [])
      }
    } catch (err) {
      console.error('Error fetching brands:', err)
      toast.error('Failed to load brands')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [statusFilter, search])

  const toggleStatus = async (brand: any) => {
    try {
      const res = await fetch(`/api/admin/brands/${brand._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !brand.isActive }),
      })
      if (res.ok) {
        toast.success(`Brand account ${brand.isActive ? 'suspended' : 'activated'}`)
        fetchBrands()
      } else {
        toast.error('Failed to update brand status')
      }
    } catch (err) {
      toast.error('Error updating status')
    }
  }

  const handleDelete = async () => {
    if (!brandToDelete) return
    try {
      setDeleting(true)
      const res = await fetch(`/api/admin/brands/${brandToDelete._id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast.success('Brand soft deleted successfully')
        setBrandToDelete(null)
        fetchBrands()
      } else {
        toast.error('Failed to delete brand')
      }
    } catch (err) {
      toast.error('Error deleting brand')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Brand Management Directory
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            View, audit, manage, and verify enterprise brand accounts and campaign creators.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company name, contact, email, or mobile..."
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
              <SelectItem value="ALL">All Accounts</SelectItem>
              <SelectItem value="ACTIVE">Active Only</SelectItem>
              <SelectItem value="SUSPENDED">Suspended Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Brands Table */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand / Company</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email & Mobile</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Campaigns</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading brand directory...
                </TableCell>
              </TableRow>
            ) : brands.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-muted-foreground">
                  No brand partners found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              brands.map((b) => (
                <TableRow key={b._id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">
                        {b.companyName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">{b.industry}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-foreground">{b.contactPerson}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div>{b.email}</div>
                    <div className="text-[11px] text-muted-foreground/80">{b.phone || '—'}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {b.city ? `${b.city}, ${b.state}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs font-bold">
                      {b.totalCampaigns}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        b.isActive
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                      }`}
                    >
                      {b.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(b.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button asChild size="sm" variant="ghost" className="h-8 px-2 rounded-lg text-xs">
                        <Link href={`/admin/brands/${b._id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(b)}
                        className={`h-8 px-2 rounded-lg text-xs ${
                          b.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'
                        }`}
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        {b.isActive ? 'Suspend' : 'Activate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setBrandToDelete(b)}
                        className="h-8 px-2 rounded-lg text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Soft Delete Confirmation Dialog */}
      <Dialog open={!!brandToDelete} onOpenChange={(open) => !open && setBrandToDelete(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Soft Delete Brand Account</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to soft delete &quot;{brandToDelete?.companyName}&quot;? Their past financial records and campaigns will be retained for audit compliance, but the account will be deactivated.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setBrandToDelete(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={deleting}
              onClick={handleDelete}
              className="rounded-xl text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Soft Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
