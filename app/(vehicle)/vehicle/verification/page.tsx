'use client'

import React, { useState } from 'react'
import { ShieldCheck, UploadCloud, FileText, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageUpload } from '@/components/common/ImageUpload'
import { toast } from 'sonner'

export default function VehicleVerificationPage() {
  const [rcDoc, setRcDoc] = useState('')
  const [aadharDoc, setAadharDoc] = useState('')
  const [permitDoc, setPermitDoc] = useState('')

  const handleSaveDocs = () => {
    toast.success('Fleet verification documents submitted for admin review!')
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Fleet Verification & Compliance</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Submit official government registration and permit documents to receive the &quot;Verified Fleet&quot; badge.
        </p>
      </div>

      <Card className="rounded-3xl border p-6 bg-card space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Verification Status</h3>
              <p className="text-xs text-muted-foreground">Verified partners receive 4x more brand bookings.</p>
            </div>
          </div>
          <Badge className="bg-emerald-600 text-white text-xs">
            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Verified Partner
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground block">Vehicle RC (Registration Card)</span>
            <ImageUpload
              value={rcDoc}
              onChange={setRcDoc}
              aspectRatio="video"
              placeholder="Upload clear RC photo"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground block">Owner Aadhar / PAN</span>
            <ImageUpload
              value={aadharDoc}
              onChange={setAadharDoc}
              aspectRatio="video"
              placeholder="Upload ID proof"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-foreground block">Commercial Transit Permit</span>
            <ImageUpload
              value={permitDoc}
              onChange={setPermitDoc}
              aspectRatio="video"
              placeholder="Upload city permit"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button onClick={handleSaveDocs} className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold">
            Save & Submit Documents
          </Button>
        </div>
      </Card>
    </div>
  )
}
