'use client'

import React, { useState } from 'react'
import { ShieldCheck, Check, X, FileText, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function AdminVerificationQueuePage() {
  const [verifications, setVerifications] = useState([
    {
      id: 'ver_1',
      name: 'Ramesh Kumar Fleet',
      role: 'VEHICLE_PARTNER',
      documentType: 'Vehicle RC + Commercial Transit Permit',
      vehicle: 'BR-07-EA-4521 (E-Rickshaw)',
      city: 'Darbhanga, Bihar',
      status: 'PENDING',
    },
    {
      id: 'ver_2',
      name: 'Priya Sharma',
      role: 'INFLUENCER',
      documentType: 'Government Photo ID + Channel Proof',
      niche: 'Fashion & Handloom',
      city: 'Darbhanga, Bihar',
      status: 'PENDING',
    },
  ])

  const handleApprove = (id: string) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id))
    toast.success('Partner verified! Verified badge applied to public profile.')
  }

  const handleReject = (id: string) => {
    setVerifications((prev) => prev.filter((v) => v.id !== id))
    toast.error('Verification request rejected')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Partner Verification Queue</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review government registration cards, IDs, and transit permits before awarding verified badges.
        </p>
      </div>

      <Card className="rounded-2xl border">
        <CardHeader>
          <CardTitle className="text-base font-bold">Pending Review Queue</CardTitle>
          <CardDescription className="text-xs">
            Review documentation details to maintain high marketplace trust.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Documents Submitted</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {verifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                    Verification queue is currently clear. No pending documents.
                  </TableCell>
                </TableRow>
              ) : (
                verifications.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {v.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                        {v.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground block">{v.documentType}</span>
                      <span className="text-[11px]">{v.vehicle || v.niche}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{v.city}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(v.id)}
                        className="h-8 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                      >
                        <Check className="mr-1 h-3.5 w-3.5" /> Approve & Verify
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(v.id)}
                        className="h-8 rounded-lg text-xs text-destructive"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
