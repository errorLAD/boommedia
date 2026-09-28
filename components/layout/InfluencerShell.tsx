'use client'
import React from 'react'
import { Bell, Compass, LayoutDashboard, MessageSquare, Settings, User, Video, Wallet } from 'lucide-react'
import { DashboardLayout, NavItem } from '@/components/layout/DashboardLayout'
const navItems: NavItem[] = [{ label: 'Dashboard', href: '/influencer/dashboard', icon: LayoutDashboard }, { label: 'My Profile', href: '/influencer/profile', icon: User }, { label: 'Notifications', href: '/influencer/notifications', icon: Bell }, { label: 'Available Work', href: '/influencer/campaigns', icon: Compass }, { label: 'My Campaigns', href: '/influencer/invitations', icon: Video }, { label: 'Messages', href: '/influencer/messages', icon: MessageSquare }, { label: 'Earnings', href: '/influencer/earnings', icon: Wallet }, { label: 'Settings', href: '/influencer/settings', icon: Settings }]
export function InfluencerShell({ children }: { children: React.ReactNode }) { return <DashboardLayout role="INFLUENCER" navItems={navItems}>{children}</DashboardLayout> }
