'use client'

import React, { useState, useEffect } from 'react'
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  FileText,
  Save,
  Loader2,
  CheckCircle2,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CONTENT_CATEGORIES, INDIAN_STATES } from '@/lib/utils'
import { toast } from 'sonner'

export default function BrandProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    industry: 'Consumer Goods',
    website: '',
    description: '',
    gstNumber: '',
    address: '',
    city: '',
    state: 'Bihar',
    country: 'India',
    socialLinks: {
      instagram: '',
      linkedin: '',
      youtube: '',
      facebook: '',
    },
    isVerified: false,
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const res = await fetch('/api/brand/profile')
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setForm({
              companyName: json.data.companyName || '',
              contactPerson: json.data.contactPerson || '',
              email: json.data.email || json.data.user?.email || '',
              phone: json.data.phone || json.data.user?.phone || '',
              industry: json.data.industry || 'Consumer Goods',
              website: json.data.website || '',
              description: json.data.description || '',
              gstNumber: json.data.gstNumber || '',
              address: json.data.address || '',
              city: json.data.city || '',
              state: json.data.state || 'Bihar',
              country: json.data.country || 'India',
              socialLinks: {
                instagram: json.data.socialLinks?.instagram || '',
                linkedin: json.data.socialLinks?.linkedin || '',
                youtube: json.data.socialLinks?.youtube || '',
                facebook: json.data.socialLinks?.facebook || '',
              },
              isVerified: Boolean(json.data.isVerified),
            })
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
        toast.error('Failed to load company profile')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch('/api/brand/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success('Company profile updated successfully')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (err) {
      toast.error('Error saving profile')
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Company Profile
            </h1>
            {form.isVerified ? (
              <Badge className="bg-emerald-600 text-white text-xs">
                <CheckCircle2 className="mr-1 h-3 w-3" /> Verified Business
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                Verification Pending
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your brand details, official registration numbers, and public communication handles.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Company Info */}
        <Card className="rounded-2xl border p-6 space-y-4">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-base font-bold flex items-center">
              <Building2 className="mr-2 h-4 w-4 text-primary" /> General Company Information
            </CardTitle>
            <CardDescription className="text-xs">
              Primary identification details used in campaign briefs and contracts.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Company / Brand Name *</Label>
              <Input
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Contact Person Name *</Label>
              <Input
                required
                value={form.contactPerson}
                onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Official Business Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Mobile / Phone Number</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Industry / Domain</Label>
              <Select
                value={form.industry}
                onValueChange={(val) => setForm({ ...form, industry: val })}
              >
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {CONTENT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                  <SelectItem value="Other">Other Domain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Official Website</Label>
              <Input
                placeholder="https://yourbrand.com"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <Label className="text-xs font-semibold">About Company / Brand Story</Label>
            <Textarea
              rows={3}
              placeholder="Briefly describe what your company produces and your key consumer demographic..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="rounded-xl text-xs resize-none"
            />
          </div>
        </Card>

        {/* Legal & Physical Address */}
        <Card className="rounded-2xl border p-6 space-y-4">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-base font-bold flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-primary" /> Location & Billing Details
            </CardTitle>
            <CardDescription className="text-xs">
              Used for generating tax invoices and GST receipts.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Office Address</Label>
              <Input
                placeholder="Building, street, landmark..."
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">City</Label>
              <Input
                placeholder="e.g. Darbhanga"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">State</Label>
              <Select
                value={form.state}
                onValueChange={(val) => setForm({ ...form, state: val })}
              >
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-56 rounded-xl">
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">GSTIN / Tax ID</Label>
              <Input
                placeholder="22AAAAA0000A1Z5"
                value={form.gstNumber}
                onChange={(e) => setForm({ ...form, gstNumber: e.target.value.toUpperCase() })}
                className="h-10 rounded-xl text-xs uppercase"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Country</Label>
              <Input
                value={form.country}
                disabled
                className="h-10 rounded-xl text-xs bg-muted/20"
              />
            </div>
          </div>
        </Card>

        {/* Social Media Links */}
        <Card className="rounded-2xl border p-6 space-y-4">
          <CardHeader className="p-0 pb-2">
            <CardTitle className="text-base font-bold flex items-center">
              <Globe className="mr-2 h-4 w-4 text-primary" /> Social Channels
            </CardTitle>
            <CardDescription className="text-xs">
              Social accounts creators can tag in deliverables and collaborator tags.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center">
                <Instagram className="mr-1.5 h-3.5 w-3.5 text-pink-600" /> Instagram Handle
              </Label>
              <Input
                placeholder="https://instagram.com/yourhandle"
                value={form.socialLinks.instagram}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, instagram: e.target.value },
                  })
                }
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center">
                <Linkedin className="mr-1.5 h-3.5 w-3.5 text-blue-600" /> LinkedIn Company Page
              </Label>
              <Input
                placeholder="https://linkedin.com/company/yourbrand"
                value={form.socialLinks.linkedin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, linkedin: e.target.value },
                  })
                }
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center">
                <Youtube className="mr-1.5 h-3.5 w-3.5 text-red-600" /> YouTube Channel
              </Label>
              <Input
                placeholder="https://youtube.com/@yourchannel"
                value={form.socialLinks.youtube}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, youtube: e.target.value },
                  })
                }
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center">
                <Facebook className="mr-1.5 h-3.5 w-3.5 text-blue-700" /> Facebook Page
              </Label>
              <Input
                placeholder="https://facebook.com/yourbrand"
                value={form.socialLinks.facebook}
                onChange={(e) =>
                  setForm({
                    ...form,
                    socialLinks: { ...form.socialLinks, facebook: e.target.value },
                  })
                }
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary text-white font-semibold shadow-sm px-6"
          >
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
