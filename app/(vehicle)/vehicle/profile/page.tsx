'use client'

import React, { useState, useEffect } from 'react'
import {
  User,
  Building,
  Truck,
  ShieldCheck,
  UploadCloud,
  Loader2,
  Save,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/common/ImageUpload'
import { toast } from 'sonner'
import { INDIAN_STATES, formatDate } from '@/lib/utils'

export default function VehiclePartnerProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form states
  const [personal, setPersonal] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: '',
  })

  const [business, setBusiness] = useState({
    companyName: '',
    businessType: 'Fleet Operator',
    city: '',
    state: 'Bihar',
    address: '',
    bio: '',
  })

  const [fleet, setFleet] = useState({
    fleetSize: 1,
    operatingCities: '',
    fleetTypes: '',
  })

  const [documents, setDocuments] = useState<any[]>([])

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        const res = await fetch('/api/vehicle-partner/profile')
        if (res.ok) {
          const json = await res.json()
          const p = json.data
          setProfile(p)
          if (p) {
            setPersonal({
              name: p.user?.name || p.contactPerson || '',
              email: p.user?.email || p.email || '',
              phone: p.user?.phone || p.phone || '',
              profileImage: p.profileImage || '',
            })
            setBusiness({
              companyName: p.companyName || '',
              businessType: p.businessType || 'Fleet Operator',
              city: p.city || '',
              state: p.state || 'Bihar',
              address: p.address || '',
              bio: p.bio || '',
            })
            setFleet({
              fleetSize: p.fleetSize || p.totalVehicles || 1,
              operatingCities: (p.operatingCities || []).join(', '),
              fleetTypes: (p.fleetTypes || []).join(', '),
            })
            setDocuments(p.documents || [])
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch('/api/vehicle-partner/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: personal.name,
          phone: personal.phone,
          profileImage: personal.profileImage,
          companyName: business.companyName,
          businessType: business.businessType,
          city: business.city,
          state: business.state,
          address: business.address,
          bio: business.bio,
          fleetSize: Number(fleet.fleetSize) || 1,
          operatingCities: fleet.operatingCities.split(',').map((c) => c.trim()).filter(Boolean),
          fleetTypes: fleet.fleetTypes.split(',').map((t) => t.trim()).filter(Boolean),
          documents,
        }),
      })

      if (res.ok) {
        toast.success('Partner profile saved successfully!')
      } else {
        toast.error('Failed to save profile')
      }
    } catch (err) {
      toast.error('Server error saving profile')
    } finally {
      setSaving(false)
    }
  }

  const handleAddDocument = (type: string, url: string) => {
    if (!url) return
    const newDoc = {
      type,
      url,
      name: `${type} Document`,
      status: 'PENDING',
      uploadedAt: new Date(),
    }
    setDocuments((prev) => [...prev, newDoc])
    toast.success(`${type} uploaded! Remember to click Save Profile.`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  const isVerified = profile?.verificationStatus === 'VERIFIED' || profile?.verificationStatus === 'APPROVED'

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Partner Profile</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your fleet credentials, business identity, and verification documents.
          </p>
        </div>

        <Badge
          className={`text-xs px-3 py-1 font-bold ${
            isVerified ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-800'
          }`}
        >
          {isVerified ? 'Verified Partner' : 'Verification: Pending Review'}
        </Badge>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Details */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center">
              <User className="mr-2 h-4 w-4 text-amber-500" /> Personal Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
              <div className="shrink-0">
                <ImageUpload
                  value={personal.profileImage}
                  onChange={(url) => setPersonal({ ...personal, profileImage: url })}
                  folder="partner-avatars"
                  placeholder="Upload photo"
                />
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-sm font-bold text-foreground">Profile Photo</h4>
                <p className="text-xs text-muted-foreground">
                  Upload an owner photo or official company logo to build advertiser trust.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Full Name *</Label>
                <Input
                  required
                  value={personal.name}
                  onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Email Address</Label>
                <Input
                  disabled
                  value={personal.email}
                  className="h-10 rounded-xl text-xs bg-muted/40 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Mobile Number *</Label>
                <Input
                  required
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center">
              <Building className="mr-2 h-4 w-4 text-amber-500" /> Business & Fleet Entity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Company / Fleet Name *</Label>
                <Input
                  required
                  value={business.companyName}
                  onChange={(e) => setBusiness({ ...business, companyName: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Business Type</Label>
                <Select
                  value={business.businessType}
                  onValueChange={(val) => setBusiness({ ...business, businessType: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="Individual Owner" className="text-xs">Individual Vehicle Owner</SelectItem>
                    <SelectItem value="Fleet Operator" className="text-xs">Fleet Operator</SelectItem>
                    <SelectItem value="Transport Agency" className="text-xs">Transport / Logistics Agency</SelectItem>
                    <SelectItem value="Commercial Driver" className="text-xs">Commercial Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">City *</Label>
                <Input
                  required
                  value={business.city}
                  onChange={(e) => setBusiness({ ...business, city: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">State *</Label>
                <Select
                  value={business.state}
                  onValueChange={(val) => setBusiness({ ...business, state: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-56">
                    {INDIAN_STATES.map((st) => (
                      <SelectItem key={st} value={st} className="text-xs">
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Office / Hub Address</Label>
                <Input
                  value={business.address}
                  onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Number of Vehicles in Fleet</Label>
                <Input
                  type="number"
                  min={1}
                  value={fleet.fleetSize}
                  onChange={(e) => setFleet({ ...fleet, fleetSize: Number(e.target.value) })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Operating Cities (comma-separated)</Label>
                <Input
                  placeholder="Darbhanga, Patna, Muzaffarpur"
                  value={fleet.operatingCities}
                  onChange={(e) => setFleet({ ...fleet, operatingCities: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Vehicle Types Operated</Label>
                <Input
                  placeholder="E-Rickshaw, Auto, Delivery Van"
                  value={fleet.fleetTypes}
                  onChange={(e) => setFleet({ ...fleet, fleetTypes: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">About Your Fleet & Coverage</Label>
              <Textarea
                rows={3}
                placeholder="Describe your transit network, daily ridership volume, and commercial routes..."
                value={business.bio}
                onChange={(e) => setBusiness({ ...business, bio: e.target.value })}
                className="rounded-xl text-xs resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Verification Documents */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4 text-amber-500" /> Verification Documents
            </CardTitle>
            <CardDescription className="text-xs">
              Upload commercial transit permits, vehicle registration cards (RC), or government photo IDs for platform verification. Private documents are never displayed publicly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <h4 className="text-xs font-bold text-foreground">Upload Vehicle Registration / RC</h4>
                <ImageUpload
                  onChange={(url) => handleAddDocument('VEHICLE_RC', url)}
                  folder="partner-docs"
                  placeholder="Upload Vehicle RC"
                />
              </div>

              <div className="p-4 rounded-xl border bg-muted/20 space-y-3">
                <h4 className="text-xs font-bold text-foreground">Upload Identity Document / Permit</h4>
                <ImageUpload
                  onChange={(url) => handleAddDocument('GOVT_ID', url)}
                  folder="partner-docs"
                  placeholder="Upload Identity Document"
                />
              </div>
            </div>

            {/* Uploaded documents list */}
            {documents.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-foreground">Submitted Documents</h4>
                <div className="space-y-2">
                  {documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{doc.name || doc.type}</p>
                          <p className="text-[10px] text-muted-foreground">Uploaded on {formatDate(doc.uploadedAt)}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {doc.status || 'Under Review'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-6 shadow-md"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Partner Profile
          </Button>
        </div>
      </form>
    </div>
  )
}
