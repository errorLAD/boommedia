'use client'

import React, { useState, useEffect } from 'react'
import {
  History,
  Search,
  Filter,
  User,
  Shield,
  Clock,
  Loader2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [targetFilter, setTargetFilter] = useState('ALL')
  const [roleFilter, setRoleFilter] = useState('ALL')

  useEffect(() => {
    async function fetchLogs() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (targetFilter !== 'ALL') params.append('targetType', targetFilter)
        if (roleFilter !== 'ALL') params.append('userRole', roleFilter)
        if (search) params.append('search', search)

        const res = await fetch(`/api/admin/activity?${params.toString()}`)
        if (res.ok) {
          const json = await res.json()
          setLogs(json.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [targetFilter, roleFilter, search])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          System Audit & Activity Logs
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Immutable event log of administrative interventions, user registrations, verification changes, and payout records.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, action, target entity, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Select value={targetFilter} onValueChange={setTargetFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Target" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Targets</SelectItem>
              <SelectItem value="BRAND">Brand</SelectItem>
              <SelectItem value="INFLUENCER">Influencer</SelectItem>
              <SelectItem value="VEHICLE_PARTNER">Vehicle Partner</SelectItem>
              <SelectItem value="VEHICLE">Vehicle</SelectItem>
              <SelectItem value="CAMPAIGN">Campaign</SelectItem>
              <SelectItem value="PAYOUT">Payout</SelectItem>
              <SelectItem value="PLATFORM">Platform</SelectItem>
            </SelectContent>
          </Select>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="BRAND">Brand</SelectItem>
              <SelectItem value="INFLUENCER">Influencer</SelectItem>
              <SelectItem value="VEHICLE_PARTNER">Vehicle Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User / Actor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading activity logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-xs text-muted-foreground">
                  No activity log entries found matching filters.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-foreground">
                    {log.userName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                      {log.userRole || 'SYSTEM'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-semibold text-primary">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase">
                      {log.targetType}: {log.targetName}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-sm truncate">
                    {log.details}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
