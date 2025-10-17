'use client'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { createMediaRecord } from '@/action/media.action'
import { useState } from 'react'
import { Container } from '@/components/ui/Container'

export default function UploadPage() {
  const [alt, setAlt] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (url: string, path: string) => {
    if (!alt.trim()) {
      alert('Please enter alt text before uploading')
      return
    }

    setIsUploading(true)
    try {
      const result = await createMediaRecord({
        url,
        alt: alt.trim(),
        supabasePath: path,
      })

      if (result.success) {
        alert('Image uploaded and saved successfully!')
        setAlt('')
        window.location.reload()
      } else {
        alert(`Failed to save: ${result.message}`)
      }
    } catch (error) {
      alert('Error saving media')
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="py-8 min-h-screen bg-zinc-50 text-zinc-900">
      <Container>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Upload Product Image</h1>
          <p className="text-zinc-900 mb-8">
            Upload images directly to Supabase and save to media library
          </p>

          <div className="bg-white rounded-lg border border-zinc-200 p-6 space-y-6">
            {/* Alt Text Input - FIRST */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image (e.g., 'Red sneakers product shot')"
                className="w-full px-4 py-2 text-zinc-900 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isUploading}
              />
              <p className="text-sm text-zinc-500 mt-1">
                Enter alt text first, then select image to upload
              </p>
            </div>

            {/* Image Upload - SECOND */}
            <div>
              <label className="block text-sm font-semibold text-zinc-900 mb-2">Select Image</label>
              {alt.trim() ? (
                <ImageUpload onUploadComplete={handleUpload} />
              ) : (
                <div className="border-2 border-dashed border-zinc-300 rounded-lg p-8 text-center text-zinc-500">
                  Please enter alt text above first
                </div>
              )}
            </div>

            {isUploading && (
              <div className="text-center py-4">
                <div className="inline-block w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-zinc-600 mt-2">Uploading and saving...</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  )
}
