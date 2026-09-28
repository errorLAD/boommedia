'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  Shield,
  CheckCircle2,
  Users,
  Briefcase,
  Layers,
  FileText,
  Clock,
  ExternalLink,
  ChevronRight,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BrandAgencyInfluencersHub() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true)
        const res = await fetch('/api/campaigns?needsInfluencer=true')
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
    loadCampaigns()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Managed Agency Model
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Influencer Marketing Agency Hub
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            BoomMedia operates as your dedicated influencer agency. We source, vet, contract, and quality-audit creators for your briefs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="rounded-full bg-primary hover:bg-primary/90 text-white font-medium text-xs px-5 h-10 shadow-md">
            <Link href="/influencers#brief-builder">
              Submit Agency Brief <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Agency Workflow Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary" />
          How Your Agency Account Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground">
          <div className="space-y-2 p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="font-bold text-foreground text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">1</span>
              Define Your Project
            </div>
            <p className="leading-relaxed">
              Submit your target cities, budget, niche, and deliverables. You deal exclusively with the project brief rather than cold outreach.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="font-bold text-foreground text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">2</span>
              Agency Curates Roster
            </div>
            <p className="leading-relaxed">
              Our strategists match your brief with vetted creators from our 10,000+ talent network, delivering a media plan for your 1-click approval.
            </p>
          </div>

          <div className="space-y-2 p-4 rounded-2xl bg-muted/50 border border-border/50">
            <div className="font-bold text-foreground text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold">3</span>
              Milestone Escrow Delivery
            </div>
            <p className="leading-relaxed">
              We coordinate creator drafts and script revisions. Funds are held in escrow and only released upon your final content approval.
            </p>
          </div>
        </div>
      </div>

      {/* Active Agency Campaigns / Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Your Influencer Campaigns
          </h2>
          <Link href="/brand/campaigns" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            All Campaigns <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Loading your agency projects...</div>
        ) : campaigns.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-10 text-center space-y-4 bg-muted/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No active influencer campaigns yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Submit a project brief to the BoomMedia Agency and receive your custom curated creator roster within 48 hours.
              </p>
            </div>
            <Button asChild size="sm" className="rounded-full text-xs">
              <Link href="/influencers#brief-builder">Create First Agency Brief</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((camp) => (
              <div
                key={camp._id}
                className="rounded-2xl border border-border bg-card p-5 space-y-3 hover:border-primary/50 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-primary uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-primary/10">
                      {camp.type}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Status: <strong className="text-foreground font-semibold">{camp.status}</strong>
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{camp.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {camp.objective || camp.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block">Budget</span>
                    <span className="font-bold text-foreground">₹{camp.budget?.total?.toLocaleString('en-IN') || '50,000'}</span>
                  </div>
                  <Button asChild size="sm" variant="outline" className="rounded-xl text-xs h-8">
                    <Link href={`/brand/campaigns/${camp._id}`}>
                      View Agency Plan →
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Network Verification Highlight */}
      <div className="rounded-3xl border border-border bg-gradient-to-r from-card to-muted/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-sm font-bold text-foreground flex items-center justify-center sm:justify-start gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            100% Verified Influencer Network
          </h3>
          <p className="text-xs text-muted-foreground max-w-xl">
            Our talent database includes 10,000+ verified creators across 28 states. We audit audience demographics, fake follower ratios, and past brand ROAS before recommending anyone to your plan.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-full text-xs shrink-0">
          <Link href="/influencers">
            Explore Agency Services <ExternalLink className="ml-1.5 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
