'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  MapPin,
  Eye,
  CheckCircle2,
  Calendar,
  Truck,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatNumber } from '@/lib/utils'

export interface VehicleCardData {
  _id: string
  vehicleType: string
  registrationNumber?: string
  photos?: Array<{ url: string; caption?: string; isPrimary?: boolean }>
  city: string
  state: string
  operatingAreas?: string[]
  routes?: Array<{ name: string; from: string; to: string }>
  adPositions?: Array<{ position: string; size?: { width: number; height: number; unit: string } }>
  pricing?: { perDay?: number; perWeek?: number; perMonth?: number }
  estimatedDailyExposure?: number
  verificationStatus?: string
  isAvailable?: boolean
  rating?: number
}

interface VehicleCardProps {
  vehicle: VehicleCardData
  onBook?: (id: string) => void
}

export function VehicleCard({ vehicle, onBook }: VehicleCardProps) {
  const isVerified = vehicle.verificationStatus === 'VERIFIED'
  const primaryPhoto =
    vehicle.photos?.find((p) => p.isPrimary)?.url ||
    vehicle.photos?.[0]?.url ||
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80'

  const formattedType = vehicle.vehicleType.replace('_', ' ')

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col justify-between overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm transition-all hover:shadow-xl hover:border-amber-500/30">
        <div>
          {/* Vehicle Photo Container */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
            <Image
              src={primaryPhoto}
              alt={`${formattedType} advertising space`}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute top-3 left-3 flex gap-1.5">
              <Badge className="bg-amber-500 text-white font-semibold text-xs shadow-sm capitalize">
                {formattedType}
              </Badge>
              {isVerified && (
                <Badge variant="secondary" className="bg-emerald-600 text-white text-xs flex items-center space-x-1 shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5 mr-0.5" />
                  Verified
                </Badge>
              )}
            </div>
            {vehicle.isAvailable !== undefined && (
              <div className="absolute bottom-3 right-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm backdrop-blur-md ${
                    vehicle.isAvailable
                      ? 'bg-emerald-500/90 text-white'
                      : 'bg-rose-500/90 text-white'
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white mr-1 animate-pulse" />
                  {vehicle.isAvailable ? 'Available Now' : 'Booked'}
                </span>
              </div>
            )}
          </div>

          <CardContent className="p-5">
            {/* Location & Routes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs font-semibold text-foreground">
                <MapPin className="mr-1 h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>
                  {vehicle.city}, {vehicle.state}
                </span>
              </div>
              {vehicle.rating ? (
                <div className="flex items-center text-xs font-semibold">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 mr-1" />
                  {vehicle.rating.toFixed(1)}
                </div>
              ) : null}
            </div>

            {/* Operating Areas / Routes preview */}
            {vehicle.operatingAreas && vehicle.operatingAreas.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
                Areas: {vehicle.operatingAreas.join(', ')}
              </p>
            )}

            {/* Metrics */}
            <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl bg-muted/40 p-2.5 text-center">
              <div>
                <span className="text-[10px] text-muted-foreground block flex items-center justify-center">
                  <Eye className="h-3 w-3 mr-1" /> Daily Views
                </span>
                <span className="text-sm font-bold text-foreground">
                  {formatNumber(vehicle.estimatedDailyExposure || 15000)}+
                </span>
              </div>
              <div className="border-l border-border/60">
                <span className="text-[10px] text-muted-foreground block">Ad Positions</span>
                <span className="text-sm font-bold text-foreground">
                  {vehicle.adPositions?.length || 2} Spots
                </span>
              </div>
            </div>

            {/* Price Preview */}
            <div className="mt-4 flex items-baseline justify-between border-t border-border/60 pt-3">
              <span className="text-xs text-muted-foreground">Price rate:</span>
              <div className="text-right">
                <span className="text-base font-bold text-foreground">
                  {vehicle.pricing?.perWeek
                    ? formatCurrency(vehicle.pricing.perWeek)
                    : vehicle.pricing?.perMonth
                    ? formatCurrency(vehicle.pricing.perMonth)
                    : '₹4,999'}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {vehicle.pricing?.perWeek ? ' /week' : ' /month'}
                </span>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Footer Actions */}
        <div className="p-5 pt-0 grid grid-cols-2 gap-2">
          <Button asChild variant="outline" size="sm" className="rounded-xl w-full text-xs font-semibold">
            <Link href={`/vehicle-ads/${vehicle._id}`}>
              View Details
            </Link>
          </Button>
          {onBook ? (
            <Button
              size="sm"
              className="rounded-xl w-full text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
              onClick={() => onBook(vehicle._id)}
            >
              Book Ad
            </Button>
          ) : (
            <Button asChild size="sm" className="rounded-xl w-full text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
              <Link href={`/vehicle-ads/${vehicle._id}`}>
                Book Space
              </Link>
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
export default VehicleCard
