export interface VehicleCategoryItem {
  _id?: string
  key: string
  name: string
  tagline?: string
  shortDescription: string
  advertisingLocations?: string[]
  exampleUseCase?: string
  imageUrl: string
  ctaLabel?: string
  displayOrder?: number
  isActive?: boolean
}

export const DEFAULT_VEHICLE_CATEGORIES: VehicleCategoryItem[] = [
  {
    key: 'AUTO_RICKSHAW',
    name: 'Advertise on Autos',
    shortDescription: 'Show your business to people while autos travel around the city.',
    imageUrl: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Ask About Autos',
    displayOrder: 1,
    isActive: true,
  },
  {
    key: 'E_RICKSHAW',
    name: 'Advertise on E-Rickshaws',
    shortDescription: 'Use electric 3-wheelers to show your business advertisement in busy local areas.',
    imageUrl: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Ask About E-Rickshaws',
    displayOrder: 2,
    isActive: true,
  },
  {
    key: 'BUS',
    name: 'Advertise on Buses',
    shortDescription: 'Place your advertisement where many people can see it during daily travel.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Ask About Buses',
    displayOrder: 3,
    isActive: true,
  },
  {
    key: 'TAXI_CAB',
    name: 'Advertise on Taxis & Cabs',
    shortDescription: 'Make your business visible while taxis and cabs move around the city.',
    imageUrl: 'https://images.unsplash.com/photo-1511527844068-006b95d162c2?auto=format&fit=crop&w=800&q=80',
    ctaLabel: 'Ask About Taxis',
    displayOrder: 4,
    isActive: true,
  },
]
