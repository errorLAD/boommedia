'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  MapPin,
  Star,
  Instagram,
  Youtube,
  Send,
  Heart,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatNumber, formatCurrency } from '@/lib/utils'

export interface InfluencerCardData {
  _id: string
  name: string
  profileImage?: string
  city: string
  state: string
  niche: string
  totalFollowers: number
  avgEngagementRate: number
  startingPrice?: number
  rating?: number
  reviewCount?: number
  completedCampaigns?: number
  verificationStatus?: string
  socialAccounts?: Array<{
    platform: string
    handle: string
    followers: number
  }>
}

interface InfluencerCardProps {
  influencer: InfluencerCardData
  onInvite?: (id: string) => void
  onSave?: (id: string) => void
  isSaved?: boolean
}

export function InfluencerCard({
  influencer,
  onInvite,
  onSave,
  isSaved = false,
}: InfluencerCardProps) {
  const isVerified = influencer.verificationStatus === 'VERIFIED'
  const fallbackAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm transition-all hover:shadow-xl hover:border-primary/30">
        <CardContent className="p-5 flex flex-col justify-between h-full">
          <div>
            {/* Header: Photo, Name, Badge, Save Button */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-border shadow-sm shrink-0">
                  <Image
                    src={influencer.profileImage || fallbackAvatar}
                    alt={influencer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-semibold text-base text-foreground line-clamp-1">
                      {influencer.name}
                    </h4>
                    {isVerified && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3 shrink-0" />
                    <span>
                      {influencer.city}, {influencer.state}
                    </span>
                  </div>
                </div>
              </div>

              {onSave && (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    onSave(influencer._id)
                  }}
                  className={`p-1.5 rounded-full transition-colors ${
                    isSaved
                      ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>

            {/* Niche & Platforms */}
            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary" className="bg-primary/10 text-primary font-medium text-xs">
                {influencer.niche}
              </Badge>
              {influencer.rating ? (
                <Badge variant="outline" className="text-xs font-semibold flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span>{influencer.rating.toFixed(1)}</span>
                  {influencer.reviewCount ? (
                    <span className="text-muted-foreground font-normal">
                      ({influencer.reviewCount})
                    </span>
                  ) : null}
                </Badge>
              ) : null}
            </div>

            {/* Key Metrics Grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-3 text-center">
              <div>
                <span className="text-[11px] text-muted-foreground block">Followers</span>
                <span className="text-sm font-bold text-foreground">
                  {formatNumber(influencer.totalFollowers || 0)}
                </span>
              </div>
              <div className="border-l border-border/60">
                <span className="text-[11px] text-muted-foreground block">Engagement</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {influencer.avgEngagementRate || 3.8}%
                </span>
              </div>
            </div>

            {/* Starting Price */}
            <div className="mt-3 flex items-baseline justify-between text-xs">
              <span className="text-muted-foreground">Starting from:</span>
              <span className="font-bold text-foreground text-sm">
                {influencer.startingPrice
                  ? formatCurrency(influencer.startingPrice)
                  : '₹2,500'}
                <span className="text-[10px] font-normal text-muted-foreground"> /post</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
            <Button asChild variant="outline" size="sm" className="rounded-xl w-full text-xs font-semibold">
              <Link href={`/influencers/${influencer._id}`}>
                View Profile
              </Link>
            </Button>
            {onInvite ? (
              <Button
                size="sm"
                className="rounded-xl w-full text-xs font-semibold bg-primary text-white shadow-sm"
                onClick={() => onInvite(influencer._id)}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Invite
              </Button>
            ) : (
              <Button asChild size="sm" className="rounded-xl w-full text-xs font-semibold bg-primary text-white shadow-sm">
                <Link href={`/influencers/${influencer._id}`}>
                  Collaborate
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default InfluencerCard
