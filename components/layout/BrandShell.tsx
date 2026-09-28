'use client'

import React from 'react'
import {
  LayoutDashboard,
  PlusCircle,
  Megaphone,
  Users,
  Truck,
  Sparkles,
  MessageSquare,
  CreditCard,
  FileText,
  Bell,
  Building2,
  Settings,
} from 'lucide-react'
import { DashboardLayout, NavItem } from '@/components/layout/DashboardLayout'

const brandNavItems: NavItem[] = [
  { section: 'Dashboard', label: 'Dashboard', href: '/brand/dashboard', icon: LayoutDashboard },
  { section: 'Campaigns', label: 'Create Campaign', href: '/brand/campaigns/create', icon: PlusCircle },
  { section: 'Campaigns', label: 'My Campaigns', href: '/brand/campaigns', icon: Megaphone },
  { section: 'Campaigns', label: 'Influencer Campaigns', href: '/brand/campaigns?service=influencer', icon: Users },
  { section: 'Campaigns', label: 'Vehicle Advertising', href: '/brand/campaigns?service=vehicle', icon: Truck },
  { section: 'Campaigns', label: 'Recommended Options', href: '/brand/recommendations', icon: Sparkles },
  { section: 'Operations', label: 'Messages', href: '/brand/messages', icon: MessageSquare },
  { section: 'Operations', label: 'Payments', href: '/brand/payments', icon: CreditCard },
  { section: 'Operations', label: 'Documents', href: '/brand/documents', icon: FileText },
  { section: 'Account', label: 'Notifications', href: '/brand/notifications', icon: Bell },
  { section: 'Account', label: 'Company Profile', href: '/brand/profile', icon: Building2 },
  { section: 'Account', label: 'Settings', href: '/brand/settings', icon: Settings },
]

export function BrandShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="BRAND" navItems={brandNavItems}>
      {children}
    </DashboardLayout>
  )
}
