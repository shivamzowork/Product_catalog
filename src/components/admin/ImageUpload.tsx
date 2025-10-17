'use client'

import { useState } from 'react'
import { uploadImage } from '@/lib/supabase/client'

interface ImageUploadProps {
  onUploadComplete: (url: string, path: string) => void
  bucketName?: string
}

export function ImageUpload({ onUploadComplete, bucketName = 'media_files' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase
    try {
      setUploading(true)
      const result = await uploadImage(bucketName, file)
      onUploadComplete(result.publicUrl, result.path)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm text-zinc-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {uploading && <p className="text-sm text-zinc-600">Uploading...</p>}
      {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />}
    </div>
  )
}
