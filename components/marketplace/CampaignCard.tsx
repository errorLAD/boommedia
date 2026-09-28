'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Calendar,
  MapPin,
  Tag,
  Clock,
  ArrowRight,
  Briefcase,
  Layers,
  Sparkles,
  Users,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatDate } from '@/lib/utils'

export interface CampaignCardData {
  _id: string
  name: string
  slug?: string
  brandName?: string
  type: 'INFLUENCER' | 'VEHICLE' | 'COMBINED'
  status: string
  category: string
  objective?: string
  budget: {
    total: number
    influencer?: number
    vehicle?: number
    currency?: string
  }
  cities?: string[]
  states?: string[]
  deliverables?: Array<{ type: string; quantity: number }>
  startDate?: string | Date
  endDate?: string | Date
  applicationCount?: number
}

interface CampaignCardProps {
  campaign: CampaignCardData
  onApply?: (id: string) => void
  isApplied?: boolean
  showBrandName?: boolean
}

export function CampaignCard({
  campaign,
  onApply,
  isApplied = false,
  showBrandName = true,
}: CampaignCardProps) {
  const typeDetails = {
    INFLUENCER: { label: 'Influencer Campaign', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', icon: Users },
    VEHICLE: { label: 'Vehicle Advertising', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', icon: Truck },
    COMBINED: { label: 'Combined Online + Offline', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', icon: Sparkles },
  }[campaign.type] || { label: campaign.type, color: 'bg-muted text-muted-foreground', icon: Layers }

  const TypeIcon = typeDetails.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm transition-all hover:shadow-lg hover:border-primary/30">
        <CardContent className="p-6 flex flex-col justify-between h-full">
          <div>
            {/* Top Bar: Type Badge & Status */}
            <div className="flex items-center justify-between gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${typeDetails.color}`}>
                <TypeIcon className="h-3.5 w-3.5 mr-1.5" />
                {typeDetails.label}
              </span>
              <Badge variant="outline" className="text-[11px] font-medium uppercase tracking-wide">
                {campaign.status}
              </Badge>
            </div>

            {/* Title & Brand */}
            <div className="mt-3 space-y-1">
              <h3 className="font-bold text-lg text-foreground line-clamp-1">
                {campaign.name}
              </h3>
              {showBrandName && campaign.brandName && (
                <p className="text-xs text-muted-foreground font-medium flex items-center">
                  <Briefcase className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  {campaign.brandName}
                </p>
              )}
            </div>

            {/* Objective / Description snippet */}
            {campaign.objective && (
              <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {campaign.objective}
              </p>
            )}

            {/* Locations & Category */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="secondary" className="text-xs font-normal">
                <Tag className="mr-1 h-3 w-3" />
                {campaign.category}
              </Badge>

              {campaign.cities && campaign.cities.length > 0 && (
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3 text-primary shrink-0" />
                  <span className="truncate max-w-[150px]">
                    {campaign.cities.join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Budget & Deliverables Details */}
            <div className="mt-4 rounded-xl bg-muted/40 p-3 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-muted-foreground block">Total Budget</span>
                <span className="text-base font-bold text-foreground">
                  {formatCurrency(campaign.budget.total)}
                </span>
              </div>
              {campaign.deliverables && campaign.deliverables.length > 0 && (
                <div className="text-right">
                  <span className="text-[11px] text-muted-foreground block">Deliverables</span>
                  <span className="text-xs font-semibold text-foreground">
                    {campaign.deliverables.reduce((acc, d) => acc + d.quantity, 0)} Items
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4 gap-3">
            {campaign.endDate && (
              <div className="flex items-center text-[11px] text-muted-foreground">
                <Clock className="mr-1 h-3.5 w-3.5" />
                <span>Ends {formatDate(campaign.endDate)}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 ml-auto">
              <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
                <Link href={`/brand/campaigns/${campaign._id}`}>
                  Details
                </Link>
              </Button>
              {onApply && (
                <Button
                  size="sm"
                  disabled={isApplied}
                  onClick={() => onApply(campaign._id)}
                  className="rounded-xl text-xs font-semibold bg-primary text-white"
                >
                  {isApplied ? 'Applied' : 'Apply Now'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
export default CampaignCard
