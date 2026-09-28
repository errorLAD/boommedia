'use client'

import React, { useState, useEffect } from 'react'
import {
  FileText,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Loader2,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'

export default function BrandDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  // Upload modal state
  const [openModal, setOpenModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: 'OTHER',
    fileUrl: '',
  })

  const fetchDocuments = async () => {
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
      console.error('Error fetching documents:', err)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [typeFilter])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.fileUrl) {
      toast.error('Please enter document title and file URL')
      return
    }

    try {
      setUploading(true)
      const res = await fetch('/api/brand/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        toast.success('Document saved successfully')
        setOpenModal(false)
        setForm({ title: '', type: 'OTHER', fileUrl: '' })
        fetchDocuments()
      } else {
        toast.error('Failed to save document')
      }
    } catch (err) {
      toast.error('Error uploading document')
    } finally {
      setUploading(false)
    }
  }

  const filtered = documents.filter((doc) =>
    search ? doc.title?.toLowerCase().includes(search.toLowerCase()) : true
  )

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Campaign Documents & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Access tax invoices, proposals, media agreements, and creative brief assets.
          </p>
        </div>

        <Button
          onClick={() => setOpenModal(true)}
          className="rounded-xl bg-primary text-white font-semibold shadow-sm"
        >
          <Upload className="mr-2 h-4 w-4" />
          Add Document / Brief
        </Button>
      </div>

      {/* Filter and Search Bar */}
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

        <div className="flex items-center space-x-2">
          {['ALL', 'INVOICE', 'RECEIPT', 'PROPOSAL', 'AGREEMENT'].map((t) => (
            <Button
              key={t}
              size="sm"
              variant={typeFilter === t ? 'secondary' : 'ghost'}
              onClick={() => setTypeFilter(t)}
              className="rounded-xl text-xs font-medium"
            >
              {t}
            </Button>
          ))}
        </div>
      </div>

      {/* Document Cards */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="rounded-3xl border p-12 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No documents found</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Invoices, proposals, and agreements associated with your campaigns will appear here automatically. You can also upload brand guideline assets or briefs manually.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <Card
              key={doc._id}
              className="rounded-2xl border p-5 flex flex-col justify-between hover:border-primary/40 transition-all shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FileText className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold">
                    {doc.type}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">{doc.title}</h4>
                  {doc.campaignId && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      Campaign: {doc.campaignId.name}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t text-[11px] text-muted-foreground flex items-center justify-between">
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(doc.createdAt)}
                  </span>
                  <span>{doc.mimeType || 'PDF / DOC'}</span>
                </div>
              </div>

              <div className="pt-4 border-t mt-4 flex items-center justify-end">
                <Button asChild size="sm" variant="outline" className="rounded-xl text-xs w-full">
                  <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                    <Download className="mr-1.5 h-3.5 w-3.5" /> View / Download
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>Add Document or Creative Brief</DialogTitle>
            <DialogDescription className="text-xs">
              Upload a brand brief, contract agreement, or tax reference file.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpload} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Document Title *</Label>
              <Input
                required
                placeholder="e.g. Brand Creative Guidelines PDF"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Document Type</Label>
              <Select
                value={form.type}
                onValueChange={(val) => setForm({ ...form, type: val })}
              >
                <SelectTrigger className="h-10 rounded-xl text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="PROPOSAL">Proposal</SelectItem>
                  <SelectItem value="AGREEMENT">Agreement / Contract</SelectItem>
                  <SelectItem value="INVOICE">Invoice</SelectItem>
                  <SelectItem value="RECEIPT">Receipt</SelectItem>
                  <SelectItem value="OTHER">Brand Asset / Brief</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">File URL / Cloudinary Link *</Label>
              <Input
                required
                placeholder="https://..."
                value={form.fileUrl}
                onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                className="h-10 rounded-xl text-xs"
              />
              <span className="text-[10px] text-muted-foreground">
                Paste link to uploaded PDF or image file.
              </span>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpenModal(false)}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={uploading}
                className="rounded-xl text-xs bg-primary text-white font-semibold"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Document'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
