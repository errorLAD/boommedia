'use client'

import React, { useState, useEffect } from 'react'
import {
  Megaphone,
  UploadCloud,
  CheckCircle2,
  Clock,
  Truck,
  Camera,
  Calendar,
  Loader2,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { ImageUpload } from '@/components/common/ImageUpload'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function VehicleCampaignsPage() {
  const [tab, setTab] = useState('ALL')
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [proofModalOpen, setProofModalOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [proofImage, setProofImage] = useState('')
  const [submittingProof, setSubmittingProof] = useState(false)

  const loadCampaigns = async (currentTab: string) => {
    try {
      setLoading(true)
      const res = await fetch(`/api/vehicle-partner/campaigns?tab=${currentTab}`)
      if (res.ok) {
        const json = await res.json()
        setCampaigns(json.data || [])
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns(tab)
  }, [tab])

  const handleOpenProof = (c: any) => {
    setSelectedCampaign(c)
    setProofImage('')
    setProofModalOpen(true)
  }

  const handleSubmitProof = async () => {
    if (!proofImage) {
      toast.error('Please upload a photo of the vehicle carrying the advertising wrap')
      return
    }

    try {
      setSubmittingProof(true)
      const res = await fetch('/api/vehicle-partner/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: selectedCampaign._id,
          proofUrl: proofImage,
          caption: 'Wrap Installation Verification Photo',
        }),
      })

      if (res.ok) {
        toast.success('Wrap installation proof submitted! The admin team will verify it shortly.')
        setProofModalOpen(false)
        loadCampaigns(tab)
      } else {
        toast.error('Failed to submit proof photo')
      }
    } catch (err) {
      toast.error('Server error submitting proof photo')
    } finally {
      setSubmittingProof(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Active & Scheduled Campaigns</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor your advertising contracts, review live run dates, and upload wrap installation proof photos.
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="rounded-xl p-1 bg-muted/60">
          <TabsTrigger value="ALL" className="rounded-lg text-xs">All Campaigns</TabsTrigger>
          <TabsTrigger value="UPCOMING" className="rounded-lg text-xs">Upcoming</TabsTrigger>
          <TabsTrigger value="ACTIVE" className="rounded-lg text-xs">Active</TabsTrigger>
          <TabsTrigger value="COMPLETED" className="rounded-lg text-xs">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
              <p className="text-xs text-muted-foreground">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <Card className="rounded-3xl border-2 border-dashed p-10 text-center bg-card">
              <div className="max-w-md mx-auto space-y-3">
                <div className="h-16 w-16 mx-auto rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Megaphone className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No Campaigns Found</h3>
                <p className="text-xs text-muted-foreground">
                  {tab === 'UPCOMING'
                    ? 'No upcoming scheduled campaigns.'
                    : tab === 'ACTIVE'
                    ? 'No advertising wraps currently running on your fleet.'
                    : tab === 'COMPLETED'
                    ? 'No completed campaigns yet.'
                    : 'Once you accept advertising requests, campaigns will appear here.'}
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {campaigns.map((c) => {
                const hasProof = c.proofImages && c.proofImages.length > 0
                return (
                  <Card key={c._id} className="rounded-2xl border p-6 bg-card shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b">
                      <div>
                        <span className="text-xs font-bold text-primary uppercase">{c.brandName}</span>
                        <h3 className="text-lg font-bold text-foreground mt-0.5">{c.campaignName}</h3>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                          <Truck className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                          Vehicle Assigned:{' '}
                          <span className="font-semibold text-foreground ml-1">
                            {c.vehicleId?.title || c.vehicleType}
                          </span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xl font-extrabold text-foreground">
                          {formatCurrency(c.partnerEarnings)}
                        </span>
                        <Badge
                          className={`mt-1 text-[10px] ml-2 ${
                            c.status === 'ACTIVE'
                              ? 'bg-emerald-600 text-white'
                              : c.status === 'COMPLETED'
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {c.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs p-3 rounded-xl bg-muted/30">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Advertising Format</span>
                        <span className="font-semibold text-foreground">{c.advertisingType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Run Dates</span>
                        <span className="font-semibold text-foreground">
                          {formatDate(c.startDate)} to {formatDate(c.endDate)}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[11px]">Proof Verification</span>
                        <span className="font-semibold text-foreground">
                          {hasProof ? `${c.proofImages.length} photo(s) submitted` : 'Pending Proof'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant={hasProof ? 'default' : 'outline'} className="text-[10px]">
                          {hasProof ? 'Proof Uploaded' : 'Wrap Verification Pending'}
                        </Badge>
                      </div>

                      <Button
                        size="sm"
                        variant={hasProof ? 'outline' : 'default'}
                        onClick={() => handleOpenProof(c)}
                        className="rounded-xl text-xs"
                      >
                        <Camera className="mr-1.5 h-3.5 w-3.5" />
                        {hasProof ? 'Upload Another Photo' : 'Submit Installation Proof'}
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Proof Upload Modal */}
      <Dialog open={proofModalOpen} onOpenChange={setProofModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Submit Wrap Installation Proof</DialogTitle>
            <DialogDescription className="text-xs">
              Upload a clear photo of the vehicle carrying the brand&apos;s advertisement wrap to verify milestone execution.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <ImageUpload
              value={proofImage}
              onChange={setProofImage}
              folder="campaign-proofs"
              aspectRatio="video"
              placeholder="Upload photo showing wrap on vehicle"
            />
          </div>

          <DialogFooter className="pt-3 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProofModalOpen(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={submittingProof || !proofImage}
              onClick={handleSubmitProof}
              className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              {submittingProof ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
              Submit Proof
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
