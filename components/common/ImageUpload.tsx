'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  folder?: string
  aspectRatio?: 'square' | 'video' | 'banner'
  className?: string
  placeholder?: string
}

export function ImageUpload({
  value,
  onChange,
  folder = 'general',
  aspectRatio = 'square',
  className = '',
  placeholder = 'Upload image (JPG, PNG, WebP up to 5MB)',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit')
      return
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WebP or GIF images allowed')
      return
    }

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      onChange(data.url)
      toast.success('Image uploaded successfully')
    } catch (err: any) {
      console.error('Image upload error:', err)
      toast.error(err.message || 'Image upload failed. Using local preview.')
      // Fallback: create an object URL for preview if API fails in dev mode
      const localUrl = URL.createObjectURL(file)
      onChange(localUrl)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square max-w-[200px]'
      : aspectRatio === 'video'
      ? 'aspect-video w-full'
      : 'aspect-[3/1] w-full'

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className={`relative overflow-hidden rounded-2xl border border-border group ${aspectClass}`}>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="h-9 w-9 rounded-full shadow-lg"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/20 p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/40 cursor-pointer ${aspectClass}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="text-xs font-medium text-foreground">Click to upload</p>
              <p className="text-[11px] text-muted-foreground">{placeholder}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
export default ImageUpload
