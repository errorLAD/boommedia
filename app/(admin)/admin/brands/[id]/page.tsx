'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Megaphone,
  FileText,
  ShieldCheck,
  ShieldAlert,
  Ban,
  Trash2,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminBrandDetailPage() {
  const params = useParams()
  const router = useRouter()
  const brandId = params.id as string

  const [brand, setBrand] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchBrand = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/brands/${brandId}`)
      if (res.ok) {
        const json = await res.json()
        setBrand(json.data)
      } else {
        toast.error('Brand not found')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error fetching brand')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (brandId) fetchBrand()
  }, [brandId])

  const toggleStatus = async () => {
    if (!brand?.user) return
    try {
      const res = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !brand.user.isActive }),
      })
      if (res.ok) {
        toast.success(`Brand account ${brand.user.isActive ? 'suspended' : 'activated'}`)
        fetchBrand()
      }
    } catch (err) {
      toast.error('Error updating status')
    }
  }

  const toggleVerification = async () => {
    if (!brand?.user) return
    try {
      const res = await fetch(`/api/admin/brands/${brandId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified: !brand.user.isVerified }),
      })
      if (res.ok) {
        toast.success(`Verification status updated`)
        fetchBrand()
      }
    } catch (err) {
      toast.error('Error updating verification')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="text-center py-16 space-y-3">
        <h3 className="font-bold text-lg">Brand account not found</h3>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin/brands">Back to Brands Directory</Link>
        </Button>
      </div>
    )
  }

  const user = brand.user
  const profile = brand.profile || {}
  const campaigns = brand.campaigns || []
  const payments = brand.payments || []
  const documents = brand.documents || []

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Button asChild variant="ghost" size="sm" className="rounded-xl">
            <Link href="/admin/brands">
              <ArrowLeft className="h-4 w-4 mr-1" /> All Brands
            </Link>
          </Button>
          <div className="h-4 w-[1px] bg-border" />
          <span className="text-xs text-muted-foreground font-semibold">Brand Overview</span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={toggleVerification}
            className="rounded-xl text-xs"
          >
            <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-primary" />
            {user.isVerified ? 'Revoke Verification' : 'Mark Verified'}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleStatus}
            className={`rounded-xl text-xs ${
              user.isActive ? 'text-amber-600' : 'text-emerald-600'
            }`}
          >
            <Ban className="h-3.5 w-3.5 mr-1.5" />
            {user.isActive ? 'Suspend Account' : 'Activate Account'}
          </Button>
        </div>
      </div>

      {/* Brand Header Card */}
      <Card className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs uppercase font-bold">
                {profile.industry || 'Brand'}
              </Badge>
              <Badge
                variant="outline"
                className={`text-xs uppercase font-bold ${
                  user.isActive
                    ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                    : 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                }`}
              >
                {user.isActive ? 'Active' : 'Suspended'}
              </Badge>
              {user.isVerified && (
                <Badge className="bg-emerald-600 text-white text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Business
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {profile.companyName || user.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1 text-primary" /> {user.email}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Phone className="h-3.5 w-3.5 mr-1 text-primary" /> {user.phone || 'No phone'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-primary" />{' '}
                {profile.city ? `${profile.city}, ${profile.state}` : 'India'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" /> Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </div>

          <div className="text-right border-l pl-6 hidden sm:block">
            <span className="text-xs text-muted-foreground block">Active Campaigns</span>
            <span className="text-2xl font-extrabold text-foreground">{campaigns.length}</span>
          </div>
        </div>

        {profile.description && (
          <p className="text-xs text-muted-foreground pt-2 border-t leading-relaxed">
            {profile.description}
          </p>
        )}
      </Card>

      {/* Tabs: Campaigns, Payments, Documents */}
      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="w-full justify-start rounded-2xl p-1 bg-card border">
          <TabsTrigger value="campaigns" className="rounded-xl px-5 text-xs font-semibold">
            Campaigns ({campaigns.length})
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl px-5 text-xs font-semibold">
            Payments ({payments.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-xl px-5 text-xs font-semibold">
            Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="mt-6 space-y-4">
          {campaigns.length === 0 ? (
            <Card className="rounded-2xl border p-10 text-center text-xs text-muted-foreground">
              No campaigns launched by this brand yet.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campaigns.map((c: any) => (
                <Card key={c._id} className="rounded-2xl border p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase mb-1">
                        {c.serviceType || c.type}
                      </Badge>
                      <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                    </div>
                    <Badge variant="outline" className="text-xs uppercase">
                      {c.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>Budget: {formatCurrency(c.budgetAmount || c.budget?.total || 0)}</div>
                    <div>Created: {formatDate(c.createdAt)}</div>
                  </div>
                  <Button asChild size="sm" variant="ghost" className="w-full text-xs rounded-xl">
                    <Link href={`/admin/brand-campaigns`}>View in Brand Campaigns ➔</Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="mt-6 space-y-4">
          {payments.length === 0 ? (
            <Card className="rounded-2xl border p-10 text-center text-xs text-muted-foreground">
              No transactions logged for this brand.
            </Card>
          ) : (
            <Card className="rounded-2xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((p: any) => (
                    <TableRow key={p._id}>
                      <TableCell className="font-mono text-xs">{p.razorpayOrderId || p._id}</TableCell>
                      <TableCell className="text-xs font-bold">{formatCurrency(p.amount || 0)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(p.createdAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6 space-y-4">
          {documents.length === 0 ? (
            <Card className="rounded-2xl border p-10 text-center text-xs text-muted-foreground">
              No documents uploaded for this brand.
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((d: any) => (
                <Card key={d._id} className="rounded-2xl border p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="font-bold text-xs text-foreground block">{d.title}</span>
                    <span className="text-[10px] text-muted-foreground">{d.type}</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-xl text-xs">
                    <a href={d.fileUrl} target="_blank" rel="noreferrer">
                      Download ↗
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
