'use client'

import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  Building,
  Smartphone,
  Save,
  Loader2,
  ShieldCheck,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'

export default function VehicleSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    upiId: '',
    maskedAccountNumber: '',
    hasAccountNumber: false,
  })

  useEffect(() => {
    async function loadBank() {
      try {
        setLoading(true)
        const res = await fetch('/api/vehicle-partner/bank-details')
        if (res.ok) {
          const json = await res.json()
          const b = json.data || {}
          setBankData({
            accountHolderName: b.accountHolderName || '',
            accountNumber: '',
            ifscCode: b.ifscCode || '',
            bankName: b.bankName || '',
            upiId: b.upiId || '',
            maskedAccountNumber: b.maskedAccountNumber || '',
            hasAccountNumber: b.hasAccountNumber || false,
          })
        }
      } catch (err) {
        console.error('Failed to load bank details:', err)
      } finally {
        setLoading(false)
      }
    }
    loadBank()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch('/api/vehicle-partner/bank-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountHolderName: bankData.accountHolderName,
          accountNumber: bankData.accountNumber || undefined,
          ifscCode: bankData.ifscCode,
          bankName: bankData.bankName,
          upiId: bankData.upiId,
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to update payout settings')

      const b = json.data || {}
      setBankData({
        ...bankData,
        accountHolderName: b.accountHolderName || '',
        accountNumber: '',
        maskedAccountNumber: b.maskedAccountNumber || '',
        hasAccountNumber: b.hasAccountNumber || false,
      })

      toast.success('Payout settings securely updated!')
    } catch (err: any) {
      toast.error(err.message || 'Error updating settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Payout & Bank Settings</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Configure direct deposit details for automated campaign payouts to your bank account or UPI ID.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bank Account */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center">
              <Building className="mr-2 h-4 w-4 text-amber-500" /> Bank Account Details
            </CardTitle>
            <CardDescription className="text-xs">
              Direct NEFT / IMPS payouts will be dispatched to this account upon milestone approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Account Holder Name</Label>
                <Input
                  placeholder="As per bank passbook"
                  value={bankData.accountHolderName}
                  onChange={(e) => setBankData({ ...bankData, accountHolderName: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Bank Name</Label>
                <Input
                  placeholder="e.g. State Bank of India, HDFC Bank"
                  value={bankData.bankName}
                  onChange={(e) => setBankData({ ...bankData, bankName: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Bank Account Number</Label>
                  {bankData.hasAccountNumber && (
                    <span className="text-[11px] text-emerald-600 font-semibold flex items-center">
                      <Lock className="h-3 w-3 mr-1" /> Saved: {bankData.maskedAccountNumber}
                    </span>
                  )}
                </div>
                <Input
                  type="password"
                  placeholder={bankData.hasAccountNumber ? 'Leave blank to keep current' : 'Enter account number'}
                  value={bankData.accountNumber}
                  onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                  className="h-10 rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">IFSC Code</Label>
                <Input
                  placeholder="e.g. SBIN0001234"
                  value={bankData.ifscCode}
                  onChange={(e) => setBankData({ ...bankData, ifscCode: e.target.value.toUpperCase() })}
                  className="h-10 rounded-xl text-xs uppercase"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* UPI ID */}
        <Card className="rounded-2xl border bg-card">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center">
              <Smartphone className="mr-2 h-4 w-4 text-amber-500" /> UPI Payout
            </CardTitle>
            <CardDescription className="text-xs">
              Fast withdrawal option for instant credit to PhonePe, Google Pay, or Paytm.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5 max-w-md">
              <Label className="text-xs font-semibold">UPI ID / VPA</Label>
              <Input
                placeholder="mobile@paytm, user@okaxis"
                value={bankData.upiId}
                onChange={(e) => setBankData({ ...bankData, upiId: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-6 shadow-md"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Payout Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
