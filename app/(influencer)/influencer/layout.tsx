import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { InfluencerShell } from '@/components/layout/InfluencerShell'

export default async function InfluencerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/influencer/login')
  }

  if ((session.user as any).role !== 'INFLUENCER') {
    redirect('/')
  }

  return (
    <InfluencerShell>{children}</InfluencerShell>
  )
}
