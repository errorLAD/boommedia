'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Truck, ArrowLeft, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { INDIAN_STATES } from '@/lib/utils'

export default function AddVehiclePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    vehicleType: 'E_RICKSHAW',
    registrationNumber: '',
    make: 'Mahindra',
    model: 'Treo',
    year: 2024,
    city: 'Darbhanga',
    state: 'Bihar',
    operatingAreas: 'Tower Chowk, Station, DMCH',
    mainRoute: 'Station Road to Laheriasarai',
    perWeek: 3500,
    perMonth: 12000,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch('/api/vehicle-partner/vehicles', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, operatingAreas: form.operatingAreas.split(',').map(area => area.trim()).filter(Boolean), route: form.mainRoute }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to add vehicle')
      toast.success('New vehicle added to your fleet successfully!')
      router.push('/vehicle/vehicles')
    } catch (err: any) {
      toast.error('Failed to add vehicle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-3">
        <Button asChild variant="ghost" size="sm" className="rounded-xl">
          <Link href="/vehicle/vehicles">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Fleet
          </Link>
        </Button>
      </div>

      <Card className="rounded-3xl border shadow-md bg-card">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add Your Vehicle</CardTitle>
          <CardDescription className="text-xs">
            Add another e-rickshaw, auto-rickshaw, or commercial delivery vehicle to earn monthly ad revenue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Vehicle Type</Label>
                <Select
                  value={form.vehicleType}
                  onValueChange={(val: string) => setForm({ ...form, vehicleType: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="E_RICKSHAW">E-Rickshaw (Toto)</SelectItem>
                    <SelectItem value="AUTO_RICKSHAW">Auto-Rickshaw</SelectItem>
                    <SelectItem value="BUS">City Bus</SelectItem>
                    <SelectItem value="TEMPO">Tempo / Three Wheeler</SelectItem>
                    <SelectItem value="DELIVERY_VEHICLE">Delivery Van</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Registration Number (Optional)</Label>
                <Input
                  required
                  placeholder="BR-07-EA-XXXX"
                  value={form.registrationNumber}
                  onChange={(e) =>
                    setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })
                  }
                  className="h-10 rounded-xl text-sm uppercase"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Operating City</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">State</Label>
                <Select
                  value={form.state}
                  onValueChange={(val: string) => setForm({ ...form, state: val })}
                >
                  <SelectTrigger className="h-10 rounded-xl text-sm">
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
                <Label className="text-xs font-semibold">Weekly Advertising Rate (₹)</Label>
                <Input
                  type="number"
                  value={form.perWeek}
                  onChange={(e) => setForm({ ...form, perWeek: Number(e.target.value) })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Monthly Advertising Rate (₹)</Label>
                <Input
                  type="number"
                  value={form.perMonth}
                  onChange={(e) => setForm({ ...form, perMonth: Number(e.target.value) })}
                  className="h-10 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-semibold">Primary Daily Route / Transit Zone</Label>
              <Input
                value={form.mainRoute}
                onChange={(e) => setForm({ ...form, mainRoute: e.target.value })}
                placeholder="e.g. Darbhanga Junction to Tower Chowk"
                className="h-10 rounded-xl text-sm"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'List Vehicle in Marketplace'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
