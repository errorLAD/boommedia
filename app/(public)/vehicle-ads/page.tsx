import React from 'react'
import type { Metadata } from 'next'
import connectDB from '@/lib/db/mongoose'
import VehicleCategory, { DEFAULT_VEHICLE_CATEGORIES } from '@/lib/db/models/VehicleCategory'
import { VehicleAdsView } from '@/components/vehicle-ads/VehicleAdsView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Advertise Your Business on Vehicles',
  description:
    'Advertise your business on autos, e-rickshaws, buses, trucks and other vehicles. Send your requirement and we will check the available options.',
  keywords: [
    'vehicle advertising',
    'auto advertising',
    'e-rickshaw advertising',
    'bus advertising',
    'truck advertising',
  ],
  openGraph: {
    title: 'Advertise Your Business on Vehicles',
    description:
      'Send your vehicle advertising requirement and we will check the available options.',
    url: 'https://boommedia.in/vehicle-ads',
    siteName: 'BoomMedia',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Vehicle Advertising in Bihar',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Advertise Your Business on Vehicles',
    description:
      'Send your vehicle advertising requirement and we will check the available options.',
    images: ['https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80'],
  },
  alternates: {
    canonical: 'https://boommedia.in/vehicle-ads',
  },
}

export default async function VehicleAdsPage() {
  let categories = []

  try {
    await connectDB()
    categories = await VehicleCategory.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 })
      .lean()

    if (!categories || categories.length === 0) {
      categories = DEFAULT_VEHICLE_CATEGORIES as any
    }
  } catch (err) {
    console.error('Error loading vehicle categories for server page:', err)
    categories = DEFAULT_VEHICLE_CATEGORIES as any
  }

  // Structured Data Schema for SEO (LocalBusiness & FAQ)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: 'Vehicle Advertising',
        provider: {
          '@type': 'LocalBusiness',
          name: 'BoomMedia',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Darbhanga',
            addressRegion: 'Bihar',
            addressCountry: 'IN',
          },
        },
        description:
          'Vehicle advertising options for businesses. Availability is checked after a business sends its requirement.',
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What types of vehicles can I advertise on?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Autos, electric 3-wheelers, buses, trucks, tempos, delivery vehicles, taxis and other commercial vehicles depending on availability.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I advertise across multiple cities?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tell us the cities you need. We will check availability before sharing options.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I choose a specific vehicle?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Availability and selection depend on the campaign requirements and available vehicle inventory.',
            },
          },
          {
            '@type': 'Question',
            name: 'How much does vehicle advertising cost?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Pricing depends on vehicle type, city, advertising location and time period. Send your requirement and we will share the available options and price.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I advertise on a fleet?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, fleet campaigns can be requested.',
            },
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VehicleAdsView categories={JSON.parse(JSON.stringify(categories))} />
    </>
  )
}
