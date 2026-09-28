'use client'

import React, { useState, useEffect } from 'react'
import { Users, Search, Shield, Ban, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (roleFilter !== 'ALL') params.append('role', roleFilter)
      if (search) params.append('search', search)

      const res = await fetch(`/api/admin/users?${params.toString()}`)
      if (res.ok) {
        const json = await res.json()
        setUsers(json.users || [])
      }
    } catch (err) {
      console.error('Fetch users error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, search])

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status: newStatus }),
      })

      if (res.ok) {
        toast.success(`User status updated to ${newStatus}`)
        fetchUsers()
      } else {
        toast.error('Failed to update status')
      }
    } catch (err) {
      toast.error('Status update error')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">User Directory & RBAC</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Monitor all registered brands, creators, transit partners, and administrators.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-44 h-10 rounded-xl text-xs bg-card">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="BRAND">Brands</SelectItem>
            <SelectItem value="INFLUENCER">Creators</SelectItem>
            <SelectItem value="VEHICLE_PARTNER">Vehicle Partners</SelectItem>
            <SelectItem value="ADMIN">Administrators</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Admin Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                  No users found matching query.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">{u.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] uppercase font-bold">
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        u.status === 'ACTIVE'
                          ? 'default'
                          : u.status === 'SUSPENDED'
                          ? 'destructive'
                          : 'outline'
                      }
                      className="text-[10px]"
                    >
                      {u.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(u.createdAt)}
                  </TableCell>
                  <TableCell className="text-right space-x-1.5">
                    {u.status !== 'ACTIVE' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(u._id, 'ACTIVE')}
                        className="h-8 rounded-lg text-xs"
                      >
                        Activate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(u._id, 'SUSPENDED')}
                        className="h-8 rounded-lg text-xs"
                      >
                        Suspend
                      </Button>
                    )}
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
