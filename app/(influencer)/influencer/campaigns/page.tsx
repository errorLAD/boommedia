'use client'

import React, { useState, useEffect } from 'react'
import { CampaignCard } from '@/components/marketplace/CampaignCard'
import { SearchFilters } from '@/components/marketplace/SearchFilters'
import { GridSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Compass } from 'lucide-react'
import { toast } from 'sonner'

export default function InfluencerDiscoverCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true)
        const res = await fetch(`/api/campaigns?type=INFLUENCER&search=${search}`)
        if (res.ok) {
          const json = await res.json()
          setCampaigns(json.data || [])
        }
      } catch (err) {
        console.error('Fetch campaigns error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadCampaigns()
  }, [search])

  const handleApply = async (campaignId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Interested in partnering on this campaign. Matches my regional audience perfectly.',
        }),
      })

      if (res.ok) {
        toast.success('Application submitted to brand for review!')
      } else {
        toast.error('Failed to apply')
      }
    } catch (err: any) {
      toast.error('Error applying to campaign')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Discover Creator Campaigns</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Apply to sponsored brand campaigns with escrow-backed payments.
        </p>
      </div>

      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Filter by campaign name, city, or niche..."
      >
        <div />
      </SearchFilters>

      {loading ? (
        <GridSkeleton count={6} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<Compass className="h-8 w-8 text-indigo-600" />}
          title="No open campaigns found"
          description="Check back soon for new brand sponsorships matching your creator profile."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <CampaignCard key={c._id} campaign={c} onApply={handleApply} />
          ))}
        </div>
      )}
    </div>
  )
}
