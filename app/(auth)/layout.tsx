import React from 'react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/40 to-amber-50/30 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}
