'use client'

import { useEffect, useState } from 'react'
import { Building2, Mail, Phone, Search, RefreshCw, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type Enquiry = {
  _id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  service: 'INFLUENCER' | 'VEHICLE' | 'BOTH'
  message?: string
  createdAt: string
}

const SERVICE_LABELS = { INFLUENCER: 'Influencer Marketing', VEHICLE: 'Vehicle Advertising', BOTH: 'Both Services' }

export default function ContactEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEnquiries = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/contact-enquiries?search=${encodeURIComponent(search)}`)
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to load enquiries.')
      setEnquiries(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load enquiries.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadEnquiries() }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Landing page submissions</p>
          <h1 className="text-2xl font-bold tracking-tight">Contact Enquiries</h1>
        </div>
        <Button variant="outline" size="sm" onClick={loadEnquiries} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">{enquiries.length} request{enquiries.length === 1 ? '' : 's'}</CardTitle>
            <form onSubmit={(event) => { event.preventDefault(); loadEnquiries() }} className="flex gap-2">
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search company or contact" className="w-full sm:w-64" />
              <Button type="submit" variant="outline" size="icon" aria-label="Search"><Search className="h-4 w-4" /></Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {error ? <p className="p-6 text-sm text-destructive">{error}</p> : loading ? <p className="p-6 text-sm text-muted-foreground">Loading enquiries…</p> : enquiries.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No contact enquiries yet.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Company & contact</TableHead><TableHead>Service</TableHead><TableHead>Message</TableHead><TableHead>Received</TableHead></TableRow></TableHeader>
              <TableBody>
                {enquiries.map((enquiry) => (
                  <TableRow key={enquiry._id}>
                    <TableCell className="min-w-[240px]"><div className="font-medium flex items-center gap-2"><Building2 className="h-4 w-4 text-muted-foreground" />{enquiry.companyName}</div><div className="mt-1 text-xs text-muted-foreground">{enquiry.contactName}</div><div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs"><a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1 hover:underline"><Mail className="h-3 w-3" />{enquiry.email}</a><a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-1 hover:underline"><Phone className="h-3 w-3" />{enquiry.phone}</a></div></TableCell>
                    <TableCell><Badge variant="secondary">{SERVICE_LABELS[enquiry.service]}</Badge></TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">{enquiry.message ? <span className="inline-flex gap-2"><MessageSquare className="h-4 w-4 shrink-0" />{enquiry.message}</span> : '—'}</TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
