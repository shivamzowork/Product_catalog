'use server'

import { getPayloadClient } from '@/payloadClient'
import { isUserAdmin } from './user.action'
import { revalidatePath } from 'next/cache'

export async function getCategories() {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'title',
    })

    return {
      success: true,
      categories: result.docs,
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { success: false, categories: [] }
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'categories',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })

    return {
      success: true,
      category: result.docs[0] || null,
    }
  } catch (error) {
    console.error('Error fetching category:', error)
    return { success: false, category: null }
  }
}

export async function createCategory(data: { title: string; slug: string; description?: string }) {
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Only admins can create categories')
    }

    const payload = await getPayloadClient()

    const category = await payload.create({
      collection: 'categories',
      data,
    })

    revalidatePath('/categories')

    return {
      success: true,
      category,
      message: 'Category created successfully',
    }
  } catch (error) {
    console.error('Error creating category:', error)
    return {
      success: false,
      category: null,
      message: error instanceof Error ? error.message : 'Failed to create category',
    }
  }
}
