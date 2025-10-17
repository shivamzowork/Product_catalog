// Client-side Supabase client (for browser/React components)
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to get public URL for uploaded images
export function getPublicUrl(bucketName: string, filePath: string) {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath)
  return data.publicUrl
}

// Helper to upload image (client-side)
export async function uploadImage(bucketName: string, file: File, path?: string) {
  const fileName = `${Date.now()}-${file.name}`
  const filePath = path ? `${path}/${fileName}` : fileName

  const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file)

  if (error) {
    throw error
  }

  return {
    path: data.path,
    publicUrl: getPublicUrl(bucketName, data.path),
  }
}

// Helper to delete image
export async function deleteImage(bucketName: string, filePath: string) {
  const { error } = await supabase.storage.from(bucketName).remove([filePath])

  if (error) {
    throw error
  }
}
