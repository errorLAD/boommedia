'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Megaphone, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/campaigns')
        if (res.ok) {
          const json = await res.json()
          setCampaigns(json.data || [])
        }
      } catch (err) {
        console.error('Fetch error:', err)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Campaign Moderation</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Review, pause, or audit live brand campaigns and compliance across regions.
        </p>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">
                  No active campaigns on platform.
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c._id}>
                  <TableCell className="font-semibold text-xs">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {c.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-bold text-foreground">
                    {formatCurrency(c.budget?.total || 0)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(c.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm" className="text-xs">
                      <Link href={`/brand/campaigns/${c._id}`}>Inspect</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
