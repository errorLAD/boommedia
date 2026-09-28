'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  CreditCard,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/notifications?limit=50')
      if (res.ok) {
        const json = await res.json()
        setNotifications(json.notifications || [])
        setUnreadCount(json.unreadCount || 0)
      }
    } catch (err) {
      console.error(err)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAllRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' })
      if (res.ok) {
        toast.success('All notifications marked as read')
        setUnreadCount(0)
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      }
    } catch (err) {
      toast.error('Failed to mark read')
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Admin Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge className="bg-primary text-white text-xs">{unreadCount} New</Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Real-time platform events, verification alerts, and new campaign submissions.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={markAllRead}
            className="rounded-xl text-xs"
          >
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark All as Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notifications.length === 0 ? (
        <Card className="rounded-3xl border p-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Bell className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No admin notifications</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When brands submit campaigns, creators submit KYC documents, or partners request payouts, you will see notifications here.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <Card
              key={notif._id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                !notif.isRead ? 'border-primary/40 bg-primary/5' : 'bg-card'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3.5">
                  <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">{notif.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {notif.body}
                    </p>
                    <span className="text-[10px] text-muted-foreground/80 mt-1 block">
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                </div>

                {notif.actionUrl && (
                  <Button asChild size="sm" variant="ghost" className="rounded-xl text-xs shrink-0">
                    <Link href={notif.actionUrl}>
                      Action <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
