import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/mongoose'
import Campaign from '@/lib/db/models/Campaign'
import CampaignRecommendation from '@/lib/db/models/CampaignRecommendation'
import CampaignDocument from '@/lib/db/models/CampaignDocument'
import ContentSubmission from '@/lib/db/models/ContentSubmission'
import {
  Megaphone,
  MapPin,
  Calendar,
  CreditCard,
  Users,
  Truck,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/utils'

interface PageProps {
  params: { id: string }
}

const STAGES = [
  { key: 'DRAFT', label: '1. Draft' },
  { key: 'SUBMITTED', label: '2. Submitted' },
  { key: 'UNDER_REVIEW', label: '3. Agency Review' },
  { key: 'OPTIONS_READY', label: '4. Options Ready' },
  { key: 'APPROVED', label: '5. Approved' },
  { key: 'IN_PROGRESS', label: '6. Active Run' },
  { key: 'COMPLETED', label: '7. Completed' },
]

function getStageIndex(status: string) {
  if (status === 'DRAFT') return 0
  if (status === 'SUBMITTED') return 1
  if (status === 'UNDER_REVIEW') return 2
  if (status === 'OPTIONS_READY' || status === 'WAITING_APPROVAL') return 3
  if (status === 'APPROVED') return 4
  if (status === 'IN_PROGRESS' || status === 'PUBLISHED') return 5
  if (status === 'COMPLETED') return 6
  return 1
}

export default async function CampaignDetailPage({ params }: PageProps) {
  await connectDB()

  let campaign: any = null
  let recommendations: any[] = []
  let documents: any[] = []
  let submissions: any[] = []

  try {
    campaign = await Campaign.findById(params.id)
      .populate('brandId', 'name email phone')
      .lean()

    if (campaign) {
      const [recs, docs, subs] = await Promise.all([
        CampaignRecommendation.find({ campaignId: params.id }).sort({ createdAt: -1 }).lean(),
        CampaignDocument.find({ campaignId: params.id, status: 'ACTIVE' }).sort({ createdAt: -1 }).lean(),
        ContentSubmission.find({ campaignId: params.id }).populate('influencerId', 'name email').lean(),
      ])
      recommendations = recs
      documents = docs
      submissions = subs
    }
  } catch (err) {
    console.error('Error finding campaign details:', err)
  }

  if (!campaign || campaign.isDeleted) {
    notFound()
  }

  const currentStageIndex = getStageIndex(campaign.status)

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Campaign Header */}
      <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs uppercase font-bold">
                {campaign.serviceType || campaign.type}
              </Badge>
              <Badge variant="outline" className="text-xs uppercase font-semibold">
                {campaign.status.replace('_', ' ')}
              </Badge>
              {campaign.isPaid ? (
                <Badge className="bg-emerald-600 text-white text-xs">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Funded
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-amber-600 border-amber-500/40">
                  <Clock className="mr-1 h-3 w-3" /> Escrow Unfunded
                </Badge>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {campaign.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center">
                <MapPin className="mr-1 h-3.5 w-3.5 text-primary" />
                {campaign.cities?.join(', ') || 'All Locations'}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="mr-1 h-3.5 w-3.5" />
                Created {formatDate(campaign.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {!campaign.isPaid && (
              <Button asChild className="rounded-xl bg-primary text-white font-semibold">
                <Link href={`/brand/payments?campaignId=${campaign._id}`}>
                  <CreditCard className="mr-1.5 h-4 w-4" /> Fund Escrow (
                  {formatCurrency(campaign.budgetAmount || campaign.budget?.total || 0)})
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/brand/messages">
                <MessageSquare className="mr-1.5 h-4 w-4" /> Agency Chat
              </Link>
            </Button>
          </div>
        </div>

        {/* 7-Stage Visual Lifecycle Progress Tracker */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span>Campaign Lifecycle Pipeline</span>
            <span className="text-primary font-bold">
              Stage {currentStageIndex + 1} of 7: {STAGES[currentStageIndex]?.label}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 pt-1">
            {STAGES.map((st, idx) => {
              const isPast = idx < currentStageIndex
              const isCurrent = idx === currentStageIndex

              return (
                <div
                  key={st.key}
                  className={`rounded-xl p-2.5 text-center text-[11px] font-semibold border transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20'
                      : isPast
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                      : 'border-border bg-muted/20 text-muted-foreground opacity-60'
                  }`}
                >
                  <div className="truncate">{st.label}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Budget Breakdown Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t pt-4 text-xs">
          <div>
            <span className="text-muted-foreground block">Total Budget</span>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(campaign.budgetAmount || campaign.budget?.total || 0)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground block">Creator Allocation</span>
            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {formatCurrency(campaign.budget?.influencer || 0)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground block">Vehicle Ad Pool</span>
            <p className="text-lg font-bold text-amber-500">
              {formatCurrency(campaign.budget?.vehicle || 0)}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground block">Curated Options</span>
            <p className="text-lg font-bold text-foreground">{recommendations.length} Recs</p>
          </div>
        </div>
      </div>

      {/* Tabs: Overview, Recommendations, Requirements, Content, Documents */}
      <Tabs defaultValue={recommendations.length > 0 ? 'recommendations' : 'overview'} className="w-full">
        <TabsList className="w-full justify-start rounded-2xl p-1 bg-card border overflow-x-auto">
          <TabsTrigger value="overview" className="rounded-xl px-5 text-xs font-semibold">
            Overview & Strategy
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="rounded-xl px-5 text-xs font-semibold">
            Agency Recommendations ({recommendations.length})
          </TabsTrigger>
          <TabsTrigger value="requirements" className="rounded-xl px-5 text-xs font-semibold">
            Detailed Requirements
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-xl px-5 text-xs font-semibold">
            Proof & Deliverables ({submissions.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="rounded-xl px-5 text-xs font-semibold">
            Documents ({documents.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card className="rounded-2xl border p-6 space-y-5">
            <div>
              <h3 className="font-bold text-base text-foreground mb-1">Product & Main Goal</h3>
              <p className="text-xs font-semibold text-primary">{campaign.product || 'Not specified'}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {campaign.goal || campaign.objective || campaign.description || 'No goal summary provided.'}
              </p>
            </div>

            <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-semibold text-foreground block mb-1">Target Locations</span>
                {campaign.targetLocations?.length > 0 ? (
                  <ul className="space-y-1 text-muted-foreground">
                    {campaign.targetLocations.map((loc: any, i: number) => (
                      <li key={i}>• {loc.city}, {loc.state} {loc.area ? `(${loc.area})` : ''}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">{campaign.cities?.join(', ') || 'All India'}</p>
                )}
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Target Audience</span>
                <p className="text-muted-foreground">
                  Age: {campaign.targetAudience?.ageGroup || 'All'} • Gender: {campaign.targetAudience?.gender || 'All'} • Language: {campaign.languages?.join(', ') || 'Hindi, English'}
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="mt-6 space-y-4">
          {recommendations.length === 0 ? (
            <Card className="rounded-2xl border p-12 text-center">
              <div className="max-w-md mx-auto space-y-3">
                <Sparkles className="h-8 w-8 text-primary mx-auto" />
                <h4 className="text-sm font-bold text-foreground">Recommendations being prepared</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our talent and transit strategists are currently vetting profiles to match your campaign goals. Once ready, they will appear here with proposed fees and deliverables.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <Card key={rec._id} className="rounded-2xl border p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="text-[10px] font-bold uppercase mb-1">
                        {rec.type}
                      </Badge>
                      <h4 className="font-bold text-sm text-foreground">
                        {rec.type === 'INFLUENCER'
                          ? rec.influencerDetails?.name || 'Creator'
                          : `${rec.vehicleDetails?.vehicleType || 'Vehicle'} Wrap`}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {rec.type === 'INFLUENCER'
                          ? `${rec.influencerDetails?.city || ''} • ${rec.influencerDetails?.category || ''}`
                          : `Route: ${rec.vehicleDetails?.route || rec.vehicleDetails?.city || ''}`}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs uppercase font-bold">
                      {rec.status}
                    </Badge>
                  </div>

                  <div className="rounded-xl border bg-muted/20 p-3 text-xs space-y-1">
                    <span className="font-semibold text-foreground block">Deliverables:</span>
                    <p className="text-muted-foreground">{rec.deliverables}</p>
                    <div className="pt-2 border-t flex justify-between font-bold text-foreground">
                      <span>Proposed Fee:</span>
                      <span>{formatCurrency(rec.proposedFee || 0)}</span>
                    </div>
                  </div>

                  <Button asChild size="sm" variant="outline" className="w-full rounded-xl text-xs">
                    <Link href="/brand/recommendations">
                      Review & Approve in Recommendations Hub ➔
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Requirements Tab */}
        <TabsContent value="requirements" className="mt-6 space-y-4">
          <Card className="rounded-2xl border p-6 space-y-4 text-xs">
            {campaign.influencerRequirements && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-foreground flex items-center">
                  <Users className="mr-1.5 h-4 w-4 text-indigo-600" /> Influencer Requirements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Creator Tier:</span>{' '}
                    {campaign.influencerRequirements.creatorType || 'Any'}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Target Creators:</span>{' '}
                    {campaign.influencerRequirements.numberOfCreators || 1}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Preferred Formats:</span>{' '}
                    {campaign.influencerRequirements.contentTypes?.join(', ') || 'Reels, Stories'}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Min Followers:</span>{' '}
                    {campaign.influencerRequirements.minFollowers || 0}
                  </div>
                </div>
              </div>
            )}

            {campaign.vehicleRequirements && (
              <div className="space-y-2 pt-4 border-t">
                <h4 className="font-bold text-sm text-foreground flex items-center">
                  <Truck className="mr-1.5 h-4 w-4 text-amber-500" /> Vehicle Requirements
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Vehicle Types:</span>{' '}
                    {campaign.vehicleRequirements.vehicleTypes?.join(', ') || 'Auto / E-Rickshaw'}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Target Fleets:</span>{' '}
                    {campaign.vehicleRequirements.numberOfVehicles || 5} Vehicles
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Ad Area:</span>{' '}
                    {campaign.vehicleRequirements.advertisingType || 'Back Panel / Full Wrap'}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Preferred Routes:</span>{' '}
                    {campaign.vehicleRequirements.preferredRoutes || 'High-traffic commercial hubs'}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-6 space-y-4">
          {submissions.length === 0 ? (
            <Card className="rounded-2xl border p-12 text-center text-xs text-muted-foreground">
              No live links or vehicle wrap proof photos submitted yet. Proof photos will be uploaded by partners once active.
            </Card>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub: any) => (
                <Card key={sub._id} className="rounded-2xl border p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-xs text-foreground block">
                        {sub.title || 'Deliverable Submission'}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Submitted by {sub.influencerId?.name} • {formatDate(sub.submittedAt || new Date())}
                      </span>
                    </div>
                    <Badge variant="outline">{sub.status}</Badge>
                  </div>

                  {sub.contentUrl && (
                    <a
                      href={sub.contentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-primary underline flex items-center"
                    >
                      <span>View Live Deliverable Link</span>
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6 space-y-4">
          {documents.length === 0 ? (
            <Card className="rounded-2xl border p-12 text-center text-xs text-muted-foreground">
              No campaign invoices or agreements uploaded yet. Documents will appear here as billing milestones are generated.
            </Card>
          ) : (
            <div className="space-y-3">
              {documents.map((doc: any) => (
                <Card key={doc._id} className="rounded-2xl border p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <span className="font-bold text-xs text-foreground block">{doc.title}</span>
                      <span className="text-[10px] text-muted-foreground">
                        {doc.type} • {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-xl text-xs">
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">
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
