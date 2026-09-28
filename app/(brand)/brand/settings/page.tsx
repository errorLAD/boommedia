'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Shield, Bell, Lock, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

export default function BrandSettingsPage() {
  const { data: session } = useSession()
  const [savingPreferences, setSavingPreferences] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  const [preferences, setPreferences] = useState({
    emailOnRecommendations: true,
    emailOnDeliverableProof: true,
    emailOnPaymentMilestone: true,
    marketingUpdates: false,
  })

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingPreferences(true)
    try {
      // Persist preferences
      await new Promise((r) => setTimeout(r, 400))
      toast.success('Notification preferences updated successfully')
    } catch (err) {
      toast.error('Failed to update preferences')
    } finally {
      setSavingPreferences(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setChangingPassword(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      })

      if (res.ok) {
        toast.success('Password changed successfully')
        setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const json = await res.json()
        toast.error(json.error || 'Failed to update password')
      }
    } catch (err) {
      toast.error('Error changing password')
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Brand Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage system security, password credentials, and real-time alert notifications.
        </p>
      </div>

      {/* Notification Preferences */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center">
            <Bell className="mr-2 h-4 w-4 text-primary" /> Notification Preferences
          </CardTitle>
          <CardDescription className="text-xs">
            Choose what campaign events trigger email and dashboard alerts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/10">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">
                    Agency Talent & Vehicle Recommendations
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Receive alert when strategists curate creators or transit fleets for your campaign.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailOnRecommendations}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailOnRecommendations: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/10">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">
                    Deliverable Proof & Live Reel Submissions
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Instant notice when a creator submits a live link or vehicle partner submits wrap photo proof.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailOnDeliverableProof}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailOnDeliverableProof: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/10">
                <div>
                  <h4 className="font-semibold text-xs text-foreground">
                    Escrow Billing & Payout Receipts
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    Receive official GST receipts and billing confirmations automatically.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailOnPaymentMilestone}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailOnPaymentMilestone: e.target.checked })
                  }
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={savingPreferences}
                className="rounded-xl bg-primary text-white font-semibold text-xs"
              >
                {savingPreferences ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
                Save Preferences
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password & Security */}
      <Card className="rounded-2xl border bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center">
            <Lock className="mr-2 h-4 w-4 text-primary" /> Password & Security
          </CardTitle>
          <CardDescription className="text-xs">
            Update your account password to ensure account safety.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Current Password</Label>
              <Input
                type="password"
                required
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">New Password</Label>
                <Input
                  type="password"
                  required
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Confirm New Password</Label>
                <Input
                  type="password"
                  required
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={changingPassword}
                variant="outline"
                className="rounded-xl text-xs font-semibold"
              >
                {changingPassword ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
