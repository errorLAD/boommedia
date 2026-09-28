'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Users,
  Truck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  MapPin,
  Tag,
  DollarSign,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function BrandRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INFLUENCER' | 'VEHICLE'>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  // Change request modal state
  const [selectedRec, setSelectedRec] = useState<any | null>(null)
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'CHANGE_REQUESTED' | null>(null)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== 'ALL') params.append('type', typeFilter)
      if (statusFilter !== 'ALL') params.append('status', statusFilter)

      const res = await fetch(`/api/brand/recommendations?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setRecommendations(json.data || [])
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      toast.error('Failed to load recommendations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [typeFilter, statusFilter])

  const handleAction = async (rec: any, action: 'APPROVE' | 'REJECT' | 'CHANGE_REQUESTED') => {
    if (action === 'APPROVE') {
      try {
        const res = await fetch('/api/brand/recommendations', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recommendationId: rec._id, action: 'APPROVE' }),
        })
        if (res.ok) {
          toast.success('Recommendation approved! The agency will schedule execution.')
          fetchRecommendations()
        } else {
          toast.error('Failed to approve recommendation')
        }
      } catch (err) {
        toast.error('Error processing approval')
      }
    } else {
      setSelectedRec(rec)
      setActionType(action)
      setNotes('')
    }
  }

  const submitModalAction = async () => {
    if (!selectedRec || !actionType) return
    try {
      setSubmitting(true)
      const res = await fetch('/api/brand/recommendations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendationId: selectedRec._id,
          action: actionType,
          notes,
        }),
      })

      if (res.ok) {
        toast.success(
          actionType === 'REJECT'
            ? 'Recommendation rejected.'
            : 'Change request sent to agency strategists.'
        )
        setSelectedRec(null)
        setActionType(null)
        setNotes('')
        fetchRecommendations()
      } else {
        toast.error('Failed to update recommendation')
      }
    } catch (err) {
      toast.error('Error submitting feedback')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Curated Talent & Fleet Recommendations
            </h1>
            <Badge className="bg-primary text-white text-[10px] font-bold">Agency Curated</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review vetted creator profiles and transit vehicle advertising routes hand-picked by our agency strategists for your campaigns.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant={typeFilter === 'ALL' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('ALL')}
            className="rounded-xl text-xs"
          >
            All Options
          </Button>
          <Button
            size="sm"
            variant={typeFilter === 'INFLUENCER' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('INFLUENCER')}
            className="rounded-xl text-xs"
          >
            <Users className="mr-1.5 h-3.5 w-3.5" /> Creators
          </Button>
          <Button
            size="sm"
            variant={typeFilter === 'VEHICLE' ? 'default' : 'outline'}
            onClick={() => setTypeFilter('VEHICLE')}
            className="rounded-xl text-xs"
          >
            <Truck className="mr-1.5 h-3.5 w-3.5" /> Vehicles
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {['ALL', 'PENDING', 'APPROVED', 'CHANGE_REQUESTED', 'REJECTED'].map((st) => (
            <Button
              key={st}
              size="sm"
              variant={statusFilter === st ? 'secondary' : 'ghost'}
              onClick={() => setStatusFilter(st)}
              className="rounded-xl text-xs font-medium"
            >
              {st.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : recommendations.length === 0 ? (
        <Card className="rounded-3xl border p-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No recommendations pending review</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When you submit a campaign brief, our agency team vets creators and vehicles matching your audience and routes, presenting them here for your 1-click approval.
            </p>
            <Button asChild size="sm" className="rounded-xl mt-2">
              <Link href="/brand/campaigns/create">Create a Campaign Brief ➔</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const isInfluencer = rec.type === 'INFLUENCER'
            const details = isInfluencer ? rec.influencerDetails : rec.vehicleDetails

            return (
              <Card key={rec._id} className="rounded-2xl border hover:border-border/80 transition-all overflow-hidden flex flex-col justify-between">
                <CardHeader className="pb-3 border-b bg-muted/10">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`text-[10px] font-bold uppercase ${
                            isInfluencer
                              ? 'bg-indigo-500/10 text-indigo-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {rec.type}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold ${
                            rec.status === 'APPROVED'
                              ? 'border-emerald-500/40 text-emerald-600 bg-emerald-500/10'
                              : rec.status === 'CHANGE_REQUESTED'
                              ? 'border-amber-500/40 text-amber-600 bg-amber-500/10'
                              : rec.status === 'REJECTED'
                              ? 'border-rose-500/40 text-rose-600 bg-rose-500/10'
                              : 'border-blue-500/40 text-blue-600 bg-blue-500/10'
                          }`}
                        >
                          {rec.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold mt-2">
                        {isInfluencer ? details?.name || 'Creator' : `${details?.vehicleType || 'Vehicle'} Ad Space`}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Campaign: {rec.campaignId?.name || 'Campaign'}
                      </CardDescription>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground block">Proposed Fee</span>
                      <span className="text-base font-extrabold text-foreground">
                        {formatCurrency(rec.proposedFee || 0)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 flex-1">
                  {/* Entity Information */}
                  {isInfluencer ? (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{details?.city || 'Location'}</span>
                        <span>•</span>
                        <Tag className="h-3.5 w-3.5 text-primary" />
                        <span>{details?.category || 'Category'}</span>
                      </div>
                      {details?.socialProfile && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <a
                            href={details.socialProfile.startsWith('http') ? details.socialProfile : `https://${details.socialProfile}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline flex items-center font-medium"
                          >
                            <span>View Social Portfolio</span>
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>City: {details?.city || 'City'}</span>
                        <span>•</span>
                        <span>Area: {details?.operatingArea || details?.advertisingArea || 'General Area'}</span>
                      </div>
                      {details?.route && (
                        <p className="text-muted-foreground">
                          <span className="font-semibold text-foreground">Route:</span> {details.route}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Deliverables */}
                  <div className="rounded-xl border bg-muted/20 p-3 text-xs space-y-1">
                    <span className="font-semibold text-foreground block">Agreed Deliverables:</span>
                    <p className="text-muted-foreground whitespace-pre-line">{rec.deliverables}</p>
                  </div>

                  {/* Notes from Brand or Agency */}
                  {rec.changeRequestNotes && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs">
                      <span className="font-semibold text-amber-700 block">Feedback / Notes:</span>
                      <p className="text-amber-600 mt-0.5">{rec.changeRequestNotes}</p>
                    </div>
                  )}
                </CardContent>

                {/* Actions Footer */}
                <div className="p-4 border-t bg-card flex items-center justify-between gap-2">
                  {rec.status === 'PENDING' || rec.status === 'CHANGE_REQUESTED' ? (
                    <>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction(rec, 'CHANGE_REQUESTED')}
                          className="rounded-xl text-xs"
                        >
                          Request Changes
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleAction(rec, 'REJECT')}
                          className="rounded-xl text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10"
                        >
                          Reject
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleAction(rec, 'APPROVE')}
                        className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Approve
                      </Button>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground italic w-full text-center">
                      Decision logged on {formatDate(rec.updatedAt || rec.createdAt)}
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Action Dialog (Change Request or Reject) */}
      <Dialog open={!!selectedRec} onOpenChange={(open) => !open && setSelectedRec(null)}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'REJECT' ? 'Reject Recommendation' : 'Request Adjustments'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {actionType === 'REJECT'
                ? 'Please share why this option does not fit your campaign goals so our strategists can find a better replacement.'
                : 'Specify what adjustments you need (e.g. deliverable format, route preference, or timing).'}
            </DialogDescription>
          </DialogHeader>

          <div className="py-2">
            <Textarea
              rows={4}
              placeholder={
                actionType === 'REJECT'
                  ? 'e.g. Profile tone doesn’t match brand identity / Prefer creator with tech audience...'
                  : 'e.g. Would prefer 2 reels instead of 1 reel + 2 stories...'
              }
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-xl text-xs"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedRec(null)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={submitting}
              onClick={submitModalAction}
              className={`rounded-xl text-xs font-semibold ${
                actionType === 'REJECT'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-primary text-white'
              }`}
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : actionType === 'REJECT' ? (
                'Confirm Rejection'
              ) : (
                'Submit Feedback'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
