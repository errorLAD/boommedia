'use client'

import React from 'react'
import {
  LayoutDashboard,
  Truck,
  PlusCircle,
  ClipboardList,
  Megaphone,
  MessageSquare,
  Wallet,
  ArrowUpRight,
  Calendar,
  User,
  Settings,
} from 'lucide-react'
import { DashboardLayout, NavItem } from '@/components/layout/DashboardLayout'

const vehicleNavItems: NavItem[] = [
  { section: 'Dashboard', label: 'Dashboard', href: '/vehicle/dashboard', icon: LayoutDashboard },
  { section: 'Fleet Management', label: 'My Vehicles', href: '/vehicle/vehicles', icon: Truck },
  { section: 'Fleet Management', label: 'Add Vehicle', href: '/vehicle/vehicles/new', icon: PlusCircle },
  { section: 'Campaigns', label: 'Advertising Requests', href: '/vehicle/requests', icon: ClipboardList },
  { section: 'Campaigns', label: 'Active Campaigns', href: '/vehicle/campaigns', icon: Megaphone },
  { section: 'Operations', label: 'Messages', href: '/vehicle/messages', icon: MessageSquare },
  { section: 'Finances', label: 'Earnings', href: '/vehicle/earnings', icon: Wallet },
  { section: 'Finances', label: 'Payouts', href: '/vehicle/payouts', icon: ArrowUpRight },
  { section: 'Fleet Management', label: 'Availability', href: '/vehicle/availability', icon: Calendar },
  { section: 'Account', label: 'Profile', href: '/vehicle/profile', icon: User },
  { section: 'Account', label: 'Settings', href: '/vehicle/settings', icon: Settings },
]

export function VehicleShell({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="VEHICLE_PARTNER" navItems={vehicleNavItems}>
      {children}
    </DashboardLayout>
  )
}
