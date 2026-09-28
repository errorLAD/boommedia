'use client'

import React, { useState, useEffect } from 'react'
import { Bell, CheckCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

interface NotificationItem {
  _id: string
  title: string
  body: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
  type: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/notifications?limit=8')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 45000)
    return () => clearInterval(interval)
  }, [])

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'PATCH' })
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Failed to mark all as read:', err)
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-xl">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute right-2 top-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-2 sm:w-96 rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0.2 text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="mr-1 h-3.5 w-3.5" />
              Mark read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />

        <div className="max-h-[350px] overflow-y-auto divide-y divide-border/40">
          {isLoading && notifications.length === 0 ? (
            <div className="flex justify-center p-6 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`p-3 text-left transition-colors hover:bg-muted/40 ${
                  !n.isRead ? 'bg-primary/5 font-medium' : ''
                }`}
              >
                {n.actionUrl ? (
                  <Link
                    href={n.actionUrl}
                    onClick={() => setIsOpen(false)}
                    className="block space-y-1"
                  >
                    <p className="text-xs text-foreground line-clamp-1">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{n.body}</p>
                    <span className="text-[10px] text-muted-foreground/80 block">
                      {formatDate(n.createdAt, 'relative')}
                    </span>
                  </Link>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xs text-foreground line-clamp-1">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{n.body}</p>
                    <span className="text-[10px] text-muted-foreground/80 block">
                      {formatDate(n.createdAt, 'relative')}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
export default NotificationBell
