'use server'

import { getPayloadClient } from '@/payloadClient'
import { isUserAdmin } from './user.action'

export async function createMediaRecord(data: { url: string; alt: string; supabasePath: string }) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Only admins can upload media')
    }

    const payload = await getPayloadClient()

    const media = await payload.create({
      collection: 'media',
      data,
    })

    return {
      success: true,
      media,
    }
  } catch (error) {
    console.error('Error creating media record:', error)
    return {
      success: false,
      media: null,
      message: error instanceof Error ? error.message : 'Failed to create media',
    }
  }
}

export async function deleteMediaRecord(id: string | number, supabasePath: string) {
  try {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Only admins can delete media')
    }

    const payload = await getPayloadClient()

    // Delete from Payload
    await payload.delete({
      collection: 'media',
      id,
    })

    // Note: You'll need to delete from Supabase Storage separately
    // using the deleteImage helper from your client-side code

    return {
      success: true,
      message: 'Media deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting media:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete media',
    }
  }
}
