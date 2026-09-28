import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { BrandShell } from '@/components/layout/BrandShell'

export default async function BrandLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/brand/login')
  }

  if ((session.user as any).role !== 'BRAND' && (session.user as any).role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <BrandShell>
      {children}
    </BrandShell>
  )
}
