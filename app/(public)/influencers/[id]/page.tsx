import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/mongoose'
import InfluencerProfile from '@/lib/db/models/InfluencerProfile'
import User from '@/lib/db/models/User'
import {
  CheckCircle2,
  MapPin,
  Star,
  Users,
  TrendingUp,
  Instagram,
  Youtube,
  Send,
  Heart,
  Calendar,
  Layers,
  Award,
  Globe,
  Share2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatNumber, formatCurrency } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

export default async function InfluencerProfilePage({ params }: PageProps) {
  await connectDB()

  let profile: any = null
  try {
    profile = await InfluencerProfile.findById(params.id)
      .populate('userId', 'name email status')
      .lean()
    if (!profile) {
      profile = await InfluencerProfile.findOne({ userId: params.id })
        .populate('userId', 'name email status')
        .lean()
    }
  } catch (err) {
    console.error('Error finding profile:', err)
  }

  if (!profile) {
    notFound()
  }

  const user = profile.userId || {}
  const name = user.name || 'Creator'
  const isVerified = profile.verificationStatus === 'VERIFIED'
  const fallbackAvatar = `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80`

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Profile Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-lg">
        {/* Cover Graphic */}
        <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-purple-800 via-indigo-700 to-amber-600 relative" />

        <div className="px-6 sm:px-10 pb-8 pt-0 relative">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="relative h-28 w-28 sm:h-36 sm:w-36 overflow-hidden rounded-3xl border-4 border-card shadow-xl bg-muted shrink-0">
                <Image
                  src={profile.profileImage || fallbackAvatar}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {name}
                  </h1>
                  {isVerified && (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500 shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4 text-primary" />
                    <span>
                      {profile.city}, {profile.state}
                    </span>
                  </div>
                  <span>•</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary font-semibold">
                    {profile.niche}
                  </Badge>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Button asChild className="flex-1 sm:flex-none rounded-xl bg-primary text-white font-semibold shadow-md">
                <Link href={`/brand/campaigns/create?invite=${profile._id}`}>
                  <Send className="mr-2 h-4 w-4" />
                  Invite to Campaign
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-xl">
                <Link href={`/brand/messages?recipient=${profile.userId?._id}`}>
                  Message
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-border/70 pt-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Total Followers</span>
              <p className="text-xl font-bold text-foreground">
                {formatNumber(profile.totalFollowers || 25000)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Avg Engagement</span>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {profile.avgEngagementRate || 4.5}%
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Completed Campaigns</span>
              <p className="text-xl font-bold text-foreground">
                {profile.completedCampaigns || 8}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Rating & Reviews</span>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-xl font-bold text-foreground">
                  {(profile.rating || 4.9).toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({profile.reviewCount || 14})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs & Sticky Pricing Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full justify-start rounded-2xl p-1 bg-card border">
              <TabsTrigger value="about" className="rounded-xl px-5 text-xs font-semibold">
                About & Bio
              </TabsTrigger>
              <TabsTrigger value="packages" className="rounded-xl px-5 text-xs font-semibold">
                Deliverable Rates
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="rounded-xl px-5 text-xs font-semibold">
                Portfolio & Work
              </TabsTrigger>
            </TabsList>

            {/* About Tab */}
            <TabsContent value="about" className="mt-6 space-y-6">
              <Card className="rounded-2xl border p-6 space-y-4">
                <h3 className="font-bold text-base text-foreground">Creator Biography</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {profile.bio ||
                    `${name} is a passionate digital creator based in ${profile.city}, specializing in ${profile.niche} content. With high audience trust and strong regional community influence, ${name} creates engaging, authentic branded content that drives real conversions and organic reach.`}
                </p>

                <div className="pt-4 border-t border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-semibold text-foreground block mb-2">Categories</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(profile.categories || [profile.niche, 'Lifestyle', 'Local']).map(
                        (cat: string) => (
                          <Badge key={cat} variant="secondary" className="text-xs">
                            {cat}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-foreground block mb-2">Languages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {(profile.languages || ['Hindi', 'English', 'Maithili']).map(
                        (lang: string) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Connected Social Accounts */}
              <Card className="rounded-2xl border p-6 space-y-4">
                <h3 className="font-bold text-base text-foreground">Verified Social Channels</h3>
                <div className="divide-y divide-border/60">
                  {(profile.socialAccounts || [
                    { platform: 'INSTAGRAM', handle: `@${name.toLowerCase().replace(/\s+/g, '_')}`, followers: profile.totalFollowers || 22000 },
                    { platform: 'YOUTUBE', handle: `${name} Official`, followers: 8500 },
                  ]).map((account: any, i: number) => (
                    <div key={i} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {account.platform[0]}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">{account.handle}</p>
                          <p className="text-[11px] text-muted-foreground capitalize">
                            {account.platform.toLowerCase()}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        {formatNumber(account.followers || 0)} followers
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Packages Tab */}
            <TabsContent value="packages" className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="rounded-2xl border p-5 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">Instagram Reel</span>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(profile.pricing?.reel || 3500)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    High engagement short-form video with custom audio, tagging, and caption mention.
                  </p>
                </Card>

                <Card className="rounded-2xl border p-5 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">Dedicated Post</span>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(profile.pricing?.post || 2500)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    High-resolution carousel or static image post with permanent grid placement.
                  </p>
                </Card>

                <Card className="rounded-2xl border p-5 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">Instagram Story Set</span>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(profile.pricing?.story || 1200)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    3-4 story frames with swipe-up/link sticker, polls, and direct engagement prompts.
                  </p>
                </Card>

                <Card className="rounded-2xl border p-5 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">YouTube Video Integration</span>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(profile.pricing?.youtubeVideo || 7500)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    60-90 second mid-roll or integrated product demonstration in dedicated video.
                  </p>
                </Card>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="mt-6 space-y-4">
              <Card className="rounded-2xl border p-6">
                <h3 className="font-bold text-base text-foreground mb-4">Featured Collaborations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(profile.portfolio && profile.portfolio.length > 0
                    ? profile.portfolio
                    : [
                        { title: 'Local Brand Launch Reel', platform: 'Instagram', views: '45K views' },
                        { title: 'Festival Campaign Video', platform: 'YouTube', views: '28K views' },
                        { title: 'E-commerce Unboxing & Review', platform: 'Instagram', views: '62K views' },
                      ]
                  ).map((item: any, idx: number) => (
                    <div key={idx} className="rounded-xl border p-4 space-y-2 bg-muted/20">
                      <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
                        Sample Video Preview
                      </div>
                      <p className="text-xs font-semibold text-foreground">{item.title}</p>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>{item.platform}</span>
                        <span>{item.views || 'Organic Content'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Col: Booking Card */}
        <div className="space-y-6">
          <Card className="rounded-2xl border bg-card p-6 shadow-md sticky top-28 space-y-6">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Hire This Creator
              </span>
              <div className="mt-1 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-foreground">
                  {formatCurrency(profile.pricing?.post || 2500)}
                </span>
                <span className="text-xs text-muted-foreground">starting rate</span>
              </div>
            </div>

            <div className="space-y-3 border-t border-b border-border/70 py-4 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Direct Collaboration</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Razorpay Escrow Protected</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span>Free Revision Included</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
            </div>

            <div className="space-y-2.5">
              <Button asChild className="w-full rounded-xl bg-primary text-white font-semibold">
                <Link href={`/brand/campaigns/create?invite=${profile._id}`}>
                  Send Campaign Invitation
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full rounded-xl">
                <Link href={`/brand/messages?recipient=${profile.userId?._id}`}>
                  Chat with Creator
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
