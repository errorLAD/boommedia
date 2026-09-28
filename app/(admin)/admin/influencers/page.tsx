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
  Eye,
  Trash2,
  Loader2,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CONTENT_CATEGORIES, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminInfluencersPage() {
  const [influencers, setInfluencers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [verificationFilter, setVerificationFilter] = useState('ALL')
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  const fetchInfluencers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (verificationFilter !== 'ALL') params.append('verificationStatus', verificationFilter)
      if (categoryFilter !== 'ALL') params.append('category', categoryFilter)

      const res = await fetch(`/api/admin/influencers?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setInfluencers(json.data || [])
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load creators')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInfluencers()
  }, [verificationFilter, categoryFilter, search])

  const toggleVerification = async (creator: any) => {
    const nextStatus = creator.isVerified ? 'UNVERIFIED' : 'VERIFIED'
    try {
      const res = await fetch(`/api/admin/influencers/${creator._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: nextStatus }),
      })
      if (res.ok) {
        toast.success(`Creator status updated to ${nextStatus}`)
        fetchInfluencers()
      } else {
        toast.error('Failed to update creator status')
      }
    } catch (err) {
      toast.error('Error updating status')
    }
  }

  const toggleStatus = async (creator: any) => {
    try {
      const res = await fetch(`/api/admin/influencers/${creator._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !creator.isActive }),
      })
      if (res.ok) {
        toast.success(`Creator account ${creator.isActive ? 'suspended' : 'activated'}`)
        fetchInfluencers()
      }
    } catch (err) {
      toast.error('Error updating status')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Creator & Influencer Directory
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review talent applications, verify social credentials, and curate creators for brand campaigns.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search creators by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-h-56 rounded-xl">
              <SelectItem value="ALL">All Niches</SelectItem>
              {CONTENT_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={verificationFilter} onValueChange={setVerificationFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="VERIFIED">Verified Only</SelectItem>
              <SelectItem value="UNVERIFIED">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Creator Name</TableHead>
              <TableHead>Category / Niche</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Verification</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading creators...
                </TableCell>
              </TableRow>
            ) : influencers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-xs text-muted-foreground">
                  No creators found matching selected criteria.
                </TableCell>
              </TableRow>
            ) : (
              influencers.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs text-foreground block">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground">{c.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      {c.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {c.city ? `${c.city}, ${c.state}` : '—'}
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {c.totalFollowers?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell>
                    {c.isVerified ? (
                      <Badge className="bg-emerald-600 text-white text-[10px]">VERIFIED</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-500/40">
                        UNVERIFIED
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase ${
                        c.isActive
                          ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                          : 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Suspended'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button asChild size="sm" variant="ghost" className="h-8 px-2 rounded-lg text-xs">
                        <Link href={`/admin/influencers/${c._id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleVerification(c)}
                        className="h-8 px-2 rounded-lg text-xs"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1 text-primary" />
                        {c.isVerified ? 'Unverify' : 'Verify'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStatus(c)}
                        className={`h-8 px-2 rounded-lg text-xs ${
                          c.isActive ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        <Ban className="h-3.5 w-3.5 mr-1" />
                        {c.isActive ? 'Suspend' : 'Activate'}
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
