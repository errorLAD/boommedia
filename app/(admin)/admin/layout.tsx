import React from 'react'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/layout/AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/admin/login')
  }

  if ((session.user as any).role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <AdminShell>{children}</AdminShell>
  )
}
