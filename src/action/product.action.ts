'use server'

import { getPayloadClient } from '@/payloadClient'
import { Product } from '@/payload-types'
import { isUserAdmin } from './user.action'
import { revalidatePath } from 'next/cache'

export async function getProducts(params?: { limit?: number; page?: number; category?: string }) {
  try {
    const payload = await getPayloadClient()

    const where: any = {
      status: { equals: 'published' },
    }

    if (params?.category) {
      where.category = { equals: params.category }
    }

    const result = await payload.find({
      collection: 'products',
      where,
      limit: params?.limit || 12,
      page: params?.page || 1,
      depth: 1,
    })

    return {
      success: true,
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { success: false, products: [], totalPages: 0, page: 1 }
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const payload = await getPayloadClient()

    const result = await payload.find({
      collection: 'products',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })

    return {
      success: true,
      product: result.docs[0] || null,
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { success: false, product: null }
  }
}

export async function createProduct(data: {
  title: string
  slug: string
  price: number
  category: string
  shortDescription?: string
  description?: any
  sku?: string
  inventory?: number
  images?: string[]
}) {
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Only admins can create products')
    }

    const payload = await getPayloadClient()

    const product = await payload.create({
      collection: 'products',
      data: {
        ...data,
        status: 'published',
      },
    })

    revalidatePath('/products')

    return {
      success: true,
      product,
      message: 'Product created successfully',
    }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      success: false,
      product: null,
      message: error instanceof Error ? error.message : 'Failed to create product',
    }
  }
}

export async function updateProduct(id: string | number, data: Partial<Product>) {
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Only admins can update products')
    }

    const payload = await getPayloadClient()

    const product = await payload.update({
      collection: 'products',
      id,
      data,
    })

    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)

    return {
      success: true,
      product,
      message: 'Product updated successfully',
    }
  } catch (error) {
    console.error('Error updating product:', error)
    return {
      success: false,
      product: null,
      message: error instanceof Error ? error.message : 'Failed to update product',
    }
  }
}

export async function deleteProduct(id: string | number) {
  try {
    // Check if user is admin
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      throw new Error('Unauthorized: Only admins can delete products')
    }

    const payload = await getPayloadClient()

    await payload.delete({
      collection: 'products',
      id,
    })

    revalidatePath('/products')

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete product',
    }
  }
}
