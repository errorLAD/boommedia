'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Sparkles,
  Menu,
  LogOut,
  Shield,
  Briefcase,
  Users,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NotificationBell } from '@/components/notifications/NotificationBell'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { getInitials } from '@/lib/utils'

export interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: string | number
  section?: string
}

interface DashboardLayoutProps {
  role: 'BRAND' | 'INFLUENCER' | 'VEHICLE_PARTNER' | 'ADMIN'
  navItems: NavItem[]
  children: React.ReactNode
}

export function DashboardLayout({ role, navItems, children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const roleMeta = {
    BRAND: { label: 'Brand Portal', badgeBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300', icon: Briefcase },
    INFLUENCER: { label: 'Creator Studio', badgeBg: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300', icon: Users },
    VEHICLE_PARTNER: { label: 'Vehicle Partner', badgeBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300', icon: Truck },
    ADMIN: { label: 'Super Administration', badgeBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300', icon: Shield },
  }[role]

  const SidebarContent = () => {
    let lastSection = ''

    return (
      <div className="flex h-full flex-col justify-between p-4">
        {/* Brand/App Header */}
        <div className="flex items-center space-x-3 px-2 pb-4 border-b border-border/70 shrink-0">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-amber-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-foreground">
                Boom<span className="text-primary font-extrabold">Media</span>
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-md inline-block w-fit mt-0.5 ${roleMeta.badgeBg}`}>
                {roleMeta.label}
              </span>
            </div>
          </Link>
        </div>

        {/* Scrollable Nav Links */}
        <div className="flex-1 overflow-y-auto py-3 pr-1 space-y-1 scrollbar-thin">
          <nav className="space-y-1">
            {navItems.map((item, idx) => {
              const Icon = item.icon
              const isSectionHeader = item.section && item.section !== lastSection
              if (item.section) {
                lastSection = item.section
              }

              const isActive =
                pathname === item.href ||
                (item.href !== `/${role.toLowerCase()}/dashboard` &&
                  item.href !== '/admin/dashboard' &&
                  item.href !== '/admin' &&
                  pathname.startsWith(`${item.href}/`))

              return (
                <React.Fragment key={`${item.href}-${idx}`}>
                  {isSectionHeader && (
                    <div className="pt-3 pb-1 px-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        {item.section}
                      </p>
                    </div>
                  )}
                  <Link
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                          isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </React.Fragment>
              )
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="border-t border-border/70 pt-3 space-y-2 shrink-0">
          <div className="flex items-center space-x-2.5 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(session?.user?.name || role)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {session?.user?.name || 'User'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full h-8 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/30"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/20 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-30 border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 border-b border-border/80 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="lg:hidden">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            </div>
            <span className="text-sm font-semibold text-foreground capitalize">
              {roleMeta.label}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <NotificationBell />
            <div className="h-4 w-px bg-border" />
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary transition-colors hidden sm:block">
              Public Marketplace ↗
            </Link>
          </div>
        </header>

        {/* Main Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
