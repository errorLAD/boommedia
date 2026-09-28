'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings,
  Building2,
  Percent,
  Calendar,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    companyName: 'BoomMedia India',
    contactEmail: 'support@boommedia.in',
    contactPhone: '+91 98765 43210',
    platformCommissionPercent: 10,
    defaultCampaignDurationDays: 30,
    autoApproveVehicles: false,
    maintenanceMode: false,
  })

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/settings')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setForm({
              companyName: json.data.companyName || 'BoomMedia India',
              contactEmail: json.data.contactEmail || 'support@boommedia.in',
              contactPhone: json.data.contactPhone || '+91 98765 43210',
              platformCommissionPercent: json.data.platformCommissionPercent || 10,
              defaultCampaignDurationDays: json.data.defaultCampaignDurationDays || 30,
              autoApproveVehicles: Boolean(json.data.autoApproveVehicles),
              maintenanceMode: Boolean(json.data.maintenanceMode),
            })
          }
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success('Platform settings updated successfully')
      } else {
        toast.error('Failed to update settings')
      }
    } catch (err) {
      toast.error('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Platform Configuration & Rules
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Adjust platform facilitation commissions, default campaign parameters, and review automation.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Business Details */}
        <Card className="rounded-2xl border p-6 space-y-4">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-base font-bold flex items-center">
              <Building2 className="mr-2 h-4 w-4 text-primary" /> General Platform Identity
            </CardTitle>
            <CardDescription className="text-xs">
              Entity information visible on invoices and customer communications.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Company / Brand Name</Label>
              <Input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Official Contact Email</Label>
              <Input
                type="email"
                value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Support Phone Number</Label>
              <Input
                value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Financial Rules */}
        <Card className="rounded-2xl border p-6 space-y-4">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-base font-bold flex items-center">
              <Percent className="mr-2 h-4 w-4 text-primary" /> Commission & Duration Settings
            </CardTitle>
            <CardDescription className="text-xs">
              Platform fees charged to brands and default run timelines.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Platform Commission (%)</Label>
              <Input
                type="number"
                min="0"
                max="50"
                value={form.platformCommissionPercent}
                onChange={(e) =>
                  setForm({ ...form, platformCommissionPercent: Number(e.target.value) })
                }
                className="h-10 rounded-xl text-xs font-bold"
              />
              <span className="text-[11px] text-muted-foreground">Default facilitation margin</span>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Default Campaign Duration (Days)</Label>
              <Input
                type="number"
                min="7"
                max="365"
                value={form.defaultCampaignDurationDays}
                onChange={(e) =>
                  setForm({ ...form, defaultCampaignDurationDays: Number(e.target.value) })
                }
                className="h-10 rounded-xl text-xs font-bold"
              />
              <span className="text-[11px] text-muted-foreground">Standard active run window</span>
            </div>
          </div>
        </Card>

        {/* Workflow & Verification Rules */}
        <Card className="rounded-2xl border p-6 space-y-4">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-base font-bold flex items-center">
              <Shield className="mr-2 h-4 w-4 text-primary" /> Automation & Controls
            </CardTitle>
            <CardDescription className="text-xs">
              Quality gates and maintenance switches.
            </CardDescription>
          </CardHeader>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/10">
              <div>
                <h4 className="font-semibold text-xs text-foreground">
                  Auto-Approve Partner Vehicles
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  If enabled, newly registered fleet vehicles bypass manual admin approval.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.autoApproveVehicles}
                onChange={(e) =>
                  setForm({ ...form, autoApproveVehicles: e.target.checked })
                }
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/10">
              <div>
                <h4 className="font-semibold text-xs text-foreground">
                  Maintenance Mode
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Temporarily pause new campaign submissions for scheduled platform upgrades.
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.maintenanceMode}
                onChange={(e) =>
                  setForm({ ...form, maintenanceMode: e.target.checked })
                }
                className="h-4 w-4 rounded text-primary focus:ring-primary"
              />
            </div>
          </div>
        </Card>

        {/* Save Changes Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary text-white font-semibold text-xs px-6"
          >
            {saving ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-2 h-3.5 w-3.5" />}
            Save Platform Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
