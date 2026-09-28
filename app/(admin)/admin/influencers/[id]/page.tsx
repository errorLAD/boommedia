'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  Users,
  MapPin,
  Calendar,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  ExternalLink,
  Instagram,
  Youtube,
  Globe,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminInfluencerDetailPage() {
  const params = useParams()
  const creatorId = params.id as string

  const [creator, setCreator] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchCreator = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/influencers/${creatorId}`)
      if (res.ok) {
        const json = await res.json()
        setCreator(json.data)
      } else {
        toast.error('Creator not found')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error fetching creator')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (creatorId) fetchCreator()
  }, [creatorId])

  const toggleVerification = async () => {
    if (!creator?.user) return
    const nextStatus = creator.user.isVerified ? 'UNVERIFIED' : 'VERIFIED'
    try {
      const res = await fetch(`/api/admin/influencers/${creatorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus: nextStatus }),
      })
      if (res.ok) {
        toast.success(`Verification status updated to ${nextStatus}`)
        fetchCreator()
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="text-center py-16 space-y-3">
        <h3 className="font-bold text-lg">Creator record not found</h3>
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/admin/influencers">Back to Directory</Link>
        </Button>
      </div>
    )
  }

  const user = creator.user
  const profile = creator.profile || {}

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Button asChild variant="ghost" size="sm" className="rounded-xl">
            <Link href="/admin/influencers">
              <ArrowLeft className="h-4 w-4 mr-1" /> All Creators
            </Link>
          </Button>
          <div className="h-4 w-[1px] bg-border" />
          <span className="text-xs text-muted-foreground font-semibold">Creator Profile</span>
        </div>

        <Button
          size="sm"
          onClick={toggleVerification}
          className={`rounded-xl text-xs font-semibold ${
            user.isVerified
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
          {user.isVerified ? 'Revoke Verification' : 'Verify Creator'}
        </Button>
      </div>

      <Card className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs uppercase font-bold">
                {profile.niche || 'Creator'}
              </Badge>
              {user.isVerified ? (
                <Badge className="bg-emerald-600 text-white text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Creator
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/40">
                  Verification Pending
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {user.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>{user.email}</span>
              <span>•</span>
              <span>{user.phone || 'No phone'}</span>
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
            <span className="text-xs text-muted-foreground block">Followers</span>
            <span className="text-2xl font-extrabold text-foreground">
              {profile.totalFollowers?.toLocaleString() || 0}
            </span>
          </div>
        </div>

        {profile.bio && (
          <p className="text-xs text-muted-foreground pt-2 border-t leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Social Accounts */}
        {profile.socialAccounts && profile.socialAccounts.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <h4 className="font-bold text-xs text-foreground">Social Accounts & Handles</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {profile.socialAccounts.map((s: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl border bg-muted/20 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-foreground block">{s.platform}</span>
                    <span className="text-muted-foreground">@{s.handle}</span>
                  </div>
                  <Badge variant="secondary">{s.followers?.toLocaleString() || 0} Followers</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
