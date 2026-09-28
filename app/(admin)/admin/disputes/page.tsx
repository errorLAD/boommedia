'use client'

import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, MessageSquare, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState([
    {
      id: 'dsp_1',
      campaign: 'Patna Food Festival Launch',
      brand: 'Patna Food Co.',
      partner: 'Rohit Verma (Creator)',
      issue: 'Delay in posting Instagram Reel after agreed milestone date',
      escrowHeld: '₹4,000',
      status: 'OPEN',
    },
  ])

  const handleResolve = (id: string, decision: string) => {
    setDisputes((prev) => prev.filter((d) => d.id !== id))
    toast.success(`Dispute resolved: ${decision}`)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Dispute Resolution Console</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Arbitrate disagreements between brands, creators, and transit vehicle partners.
        </p>
      </div>

      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Open Disputes & Escrow Holds</CardTitle>
          <CardDescription className="text-xs">
            Review claims from either party and authorize escrow release or refund.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {disputes.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No open disputes on platform. All collaborations are operating smoothly.
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((d) => (
                <div key={d.id} className="p-5 rounded-2xl border bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-foreground block">{d.campaign}</span>
                      <span className="text-xs text-muted-foreground">
                        Brand: {d.brand} • Partner: {d.partner}
                      </span>
                    </div>
                    <Badge variant="destructive" className="text-[10px]">
                      {d.status} • Escrow: {d.escrowHeld}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground p-3 rounded-xl bg-muted/30 border">
                    <span className="font-semibold text-foreground">Dispute Claim: </span>
                    {d.issue}
                  </p>

                  <div className="flex items-center justify-end space-x-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResolve(d.id, 'Refunded to Brand')}
                      className="rounded-xl text-xs"
                    >
                      Refund Brand
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResolve(d.id, 'Released to Partner')}
                      className="rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    >
                      Release Escrow to Partner
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
