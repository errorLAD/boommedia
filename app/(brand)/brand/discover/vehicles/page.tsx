'use client'

import React, { useState, useEffect } from 'react'
import { VehicleCard, VehicleCardData } from '@/components/marketplace/VehicleCard'
import { SearchFilters } from '@/components/marketplace/SearchFilters'
import { GridSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Truck } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function BrandDiscoverVehicles() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<VehicleCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadVehicles() {
      try {
        setLoading(true)
        const res = await fetch(`/api/vehicles?search=${search}&limit=12`)
        if (res.ok) {
          const json = await res.json()
          const mapped = (json.data || []).map((item: any) => ({
            _id: item._id,
            vehicleType: item.vehicleType || 'E_RICKSHAW',
            registrationNumber: item.registrationNumber,
            photos: item.photos,
            city: item.city,
            state: item.state,
            operatingAreas: item.operatingAreas,
            routes: item.routes,
            adPositions: item.adPositions,
            pricing: item.pricing,
            estimatedDailyExposure: item.estimatedDailyExposure || 18000,
            verificationStatus: item.verificationStatus,
            isAvailable: item.isAvailable !== false,
            rating: item.rating || 4.8,
          }))
          setVehicles(mapped)
        }
      } catch (err) {
        console.error('Discover vehicles error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadVehicles()
  }, [search])

  const handleBook = (id: string) => {
    router.push(`/brand/campaigns/create?type=VEHICLE&vehicleId=${id}`)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Explore Vehicle Advertising</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Browse verified e-rickshaws, autos, and buses to book street advertising campaigns.
        </p>
      </div>

      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        placeholder="Filter by city, route, or vehicle type..."
      >
        <div />
      </SearchFilters>

      {loading ? (
        <GridSkeleton count={6} />
      ) : vehicles.length === 0 ? (
        <EmptyState
          icon={<Truck className="h-8 w-8 text-amber-500" />}
          title="No vehicles found"
          description="Try searching for another city or route."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {vehicles.map((veh) => (
            <VehicleCard key={veh._id} vehicle={veh} onBook={handleBook} />
          ))}
        </div>
      )}
    </div>
  )
}
