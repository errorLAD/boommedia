'use client'

import React, { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  Building2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

export default function AdminBrandDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadDocs() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (typeFilter !== 'ALL') params.append('type', typeFilter)

        const res = await fetch(`/api/brand/documents?${params.toString()}`)
        if (res.ok) {
          const json = await res.json()
          setDocuments(json.data || [])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDocs()
  }, [typeFilter])

  const filtered = documents.filter((d) =>
    search ? d.title?.toLowerCase().includes(search.toLowerCase()) : true
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Brand Documents Repository
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Proposals, service agreements, GST invoices, and brand asset files across all client campaigns.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10 rounded-xl text-xs bg-card"
          />
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-10 rounded-xl text-xs bg-card">
              <SelectValue placeholder="Document Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="INVOICE">Invoices</SelectItem>
              <SelectItem value="RECEIPT">Receipts</SelectItem>
              <SelectItem value="PROPOSAL">Proposals</SelectItem>
              <SelectItem value="AGREEMENT">Agreements</SelectItem>
              <SelectItem value="OTHER">Other Assets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-xs text-muted-foreground">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                  Loading documents...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-xs text-muted-foreground">
                  No documents found in repository.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((d) => (
                <TableRow key={d._id}>
                  <TableCell>
                    <div className="flex items-center space-x-2.5">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-bold text-xs text-foreground">{d.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold">
                      {d.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {d.campaignId?.name || 'General / Platform'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(d.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild size="sm" variant="outline" className="h-8 rounded-xl text-xs">
                      <a href={d.fileUrl} target="_blank" rel="noreferrer">
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </a>
                    </Button>
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
