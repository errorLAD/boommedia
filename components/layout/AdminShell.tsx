'use client'

import React from 'react'
import {
  LayoutDashboard,
  Building2,
  Megaphone,
  MessageSquare,
  CreditCard,
  FileText,
  Truck,
  Car,
  ClipboardList,
  Wallet,
  ArrowUpRight,
  Users,
  CheckSquare,
  Inbox,
  Bell,
  BarChart3,
  History,
  Settings,
} from 'lucide-react'
import { DashboardLayout, NavItem } from '@/components/layout/DashboardLayout'

const adminNavItems: NavItem[] = [
  // Overview
  { section: 'Overview', label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { section: 'Overview', label: 'Inbound Leads', href: '/admin/leads', icon: Inbox },

  // Brand Management
  { section: 'Brand Management', label: 'Brands', href: '/admin/brands', icon: Building2 },
  { section: 'Brand Management', label: 'Brand Campaigns', href: '/admin/brand-campaigns', icon: Megaphone },
  { section: 'Brand Management', label: 'Brand Messages', href: '/admin/brand-messages', icon: MessageSquare },
  { section: 'Brand Management', label: 'Brand Payments', href: '/admin/brand-payments', icon: CreditCard },
  { section: 'Brand Management', label: 'Brand Documents', href: '/admin/brand-documents', icon: FileText },

  // Vehicle Management
  { section: 'Vehicle Management', label: 'Vehicle Partners', href: '/admin/vehicle-partners', icon: Users },
  { section: 'Vehicle Management', label: 'Vehicles', href: '/admin/vehicles', icon: Car },
  { section: 'Vehicle Management', label: 'Vehicle Requests', href: '/admin/vehicle-requests', icon: ClipboardList },
  { section: 'Vehicle Management', label: 'Vehicle Campaigns', href: '/admin/vehicle-campaigns', icon: Truck },
  { section: 'Vehicle Management', label: 'Vehicle Messages', href: '/admin/vehicle-messages', icon: MessageSquare },
  { section: 'Vehicle Management', label: 'Vehicle Earnings', href: '/admin/vehicle-earnings', icon: Wallet },
  { section: 'Vehicle Management', label: 'Vehicle Payouts', href: '/admin/vehicle-payouts', icon: ArrowUpRight },

  // Influencer Management
  { section: 'Influencer Management', label: 'Influencers', href: '/admin/influencers', icon: Users },
  { section: 'Influencer Management', label: 'Influencer Campaigns', href: '/admin/influencer-campaigns', icon: Megaphone },
  { section: 'Influencer Management', label: 'Influencer Applications', href: '/admin/influencer-applications', icon: CheckSquare },
  { section: 'Influencer Management', label: 'Influencer Messages', href: '/admin/influencer-messages', icon: MessageSquare },
  { section: 'Influencer Management', label: 'Influencer Earnings', href: '/admin/influencer-earnings', icon: Wallet },
  { section: 'Influencer Management', label: 'Influencer Payouts', href: '/admin/influencer-payouts', icon: ArrowUpRight },

  // Platform
  { section: 'Platform', label: 'All Messages', href: '/admin/messages', icon: Inbox },
  { section: 'Platform', label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { section: 'Platform', label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { section: 'Platform', label: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { section: 'Platform', label: 'Activity Logs', href: '/admin/activity', icon: History },
  { section: 'Platform', label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return <DashboardLayout role="ADMIN" navItems={adminNavItems}>{children}</DashboardLayout>
}

export default AdminShell
