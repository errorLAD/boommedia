import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { VehicleShell } from '@/components/layout/VehicleShell'

export default async function VehicleLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/vehicle/login')
  }

  if ((session.user as any).role !== 'VEHICLE_PARTNER' && (session.user as any).role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <VehicleShell>
      {children}
    </VehicleShell>
  )
}
