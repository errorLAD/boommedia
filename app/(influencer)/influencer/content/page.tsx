'use client'

import React, { useState } from 'react'
import { Video, UploadCloud, Link as LinkIcon, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function InfluencerContentPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState([
    {
      id: 'sub_1',
      campaign: 'Festive Handloom Showcase',
      deliverableType: 'INSTAGRAM_REEL',
      url: 'https://instagram.com/reel/C89xYz1234',
      status: 'APPROVED',
      date: 'Sep 18, 2026',
    },
    {
      id: 'sub_2',
      campaign: 'Regional App Awareness',
      deliverableType: 'YOUTUBE_VIDEO',
      url: 'https://youtube.com/watch?v=mock123',
      status: 'CHANGES_REQUESTED',
      feedback: 'Please include the download link in the top line of the description box.',
      date: 'Sep 19, 2026',
    },
  ])

  const [form, setForm] = useState({
    campaignName: 'Festive Handloom Showcase',
    deliverableType: 'INSTAGRAM_REEL',
    contentUrl: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.contentUrl) {
      toast.error('Please enter the live URL of your content')
      return
    }

    setSubmitting(true)
    setTimeout(() => {
      setSubmissions([
        {
          id: `sub_${Date.now()}`,
          campaign: form.campaignName,
          deliverableType: form.deliverableType,
          url: form.contentUrl,
          status: 'PENDING',
          date: 'Just now',
        },
        ...submissions,
      ])
      setForm({ ...form, contentUrl: '', notes: '' })
      setSubmitting(false)
      toast.success('Content submitted for brand review and milestone release!')
    }, 600)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Content Submissions & Proof</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Submit live URLs for sponsored reels, posts, and videos to unlock your escrow payouts.
        </p>
      </div>

      {/* Submission Form */}
      <Card className="rounded-3xl border bg-card p-6 shadow-sm">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-base font-bold">Submit New Deliverable</CardTitle>
          <CardDescription className="text-xs">
            Provide the live post or published video link for brand approval.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Campaign</Label>
                <Input
                  value={form.campaignName}
                  onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Deliverable Format</Label>
                <Select
                  value={form.deliverableType}
                  onValueChange={(val: string) => setForm({ ...form, deliverableType: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="INSTAGRAM_REEL">Instagram Reel</SelectItem>
                    <SelectItem value="INSTAGRAM_POST">Instagram Post</SelectItem>
                    <SelectItem value="INSTAGRAM_STORY">Instagram Story Set</SelectItem>
                    <SelectItem value="YOUTUBE_VIDEO">YouTube Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Live Content URL *</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  required
                  type="url"
                  placeholder="https://www.instagram.com/reel/..."
                  value={form.contentUrl}
                  onChange={(e) => setForm({ ...form, contentUrl: e.target.value })}
                  className="pl-10 h-10 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Notes / Reach Snapshot (Optional)</Label>
              <Textarea
                placeholder="Mention initial views, engagement stats, or comments..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="rounded-xl text-sm resize-none h-20"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
              >
                {submitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Submissions History */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-foreground">Submitted Deliverables History</h3>
        <div className="space-y-3">
          {submissions.map((sub) => (
            <Card key={sub.id} className="rounded-2xl border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-foreground block">{sub.campaign}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {sub.deliverableType.replace('_', ' ')} • {sub.date}
                  </span>
                </div>
                <Badge
                  variant={
                    sub.status === 'APPROVED'
                      ? 'default'
                      : sub.status === 'CHANGES_REQUESTED'
                      ? 'destructive'
                      : 'outline'
                  }
                  className="text-[10px]"
                >
                  {sub.status}
                </Badge>
              </div>

              <a
                href={sub.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-primary underline block truncate"
              >
                {sub.url}
              </a>

              {sub.feedback && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                  <span className="font-bold block">Brand Revision Request:</span>
                  {sub.feedback}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
