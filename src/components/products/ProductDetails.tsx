'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ShoppingCart } from 'lucide-react'
import type { Product } from '@/payload-types'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const images = Array.isArray(product.images) ? product.images : []
  const category = typeof product.category === 'object' ? product.category : null
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const mainImage = images[selectedImageIndex]
  const mainImageSrc = typeof mainImage === 'object' && mainImage?.url ? mainImage.url : ''
  const isOutOfStock = typeof product.inventory === 'number' && product.inventory === 0

  // Remove debug log
  return (
    <div>
      {/* Back Button */}
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-blue-600 mb-3"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* Breadcrumb */}
      <nav className="mb-4">
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/categories/${category.slug}`} className="hover:text-blue-600">
                {category.title}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-zinc-600">{product.title}</span>
        </div>
      </nav>

      {/* Main Content */}
      <div className="grid gap-4 lg:grid-cols-2 m-0">
        {/* Images Section */}
        <div className="m-0">
          {/* Main Image */}
          <div className="relative aspect-square bg-zinc-100 rounded-lg overflow-hidden border border-zinc-200">
            {mainImageSrc ? (
              <Image
                src={mainImageSrc}
                alt={
                  typeof mainImage === 'object' && mainImage?.alt ? mainImage.alt : product.title
                }
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-zinc-400 text-lg">No image available</span>
              </div>
            )}

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-lg font-semibold px-4 py-2 rounded-full bg-red-600">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.map((img: any, index: number) => {
                const thumbSrc = img?.url ?? ''
                return (
                  <button
                    key={img?.id ?? index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square bg-zinc-100 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index
                        ? 'border-blue-600'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    {thumbSrc ? (
                      <Image
                        src={thumbSrc}
                        alt={img?.alt ?? `${product.title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-zinc-400 text-xs">No image</span>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="">
          {/* Category Tag */}
          {category && (
            <Link
              href={`/categories/${category.slug}`}
              className="inline-block text-xs font-semibold text-zinc-600 uppercase tracking-wide"
            >
              {category.title}
            </Link>
          )}

          {/* Product Title */}
          <div className="m-0">
            <h3 className="text-2xl font-semibold text-zinc-900 mb-1">{product.title}</h3>
            {product.sku && (
              <p className="text-xs text-zinc-500 mb-0">
                SKU: <span className="font-medium">{product.sku}</span>
              </p>
            )}
          </div>

          {/* Price */}
          {typeof product.price === 'number' && (
            <div className="text-2xl font-bold text-zinc-900 mb-3">${product.price.toFixed(2)}</div>
          )}

          {/* Stock Status */}
          {typeof product.inventory === 'number' && (
            <div>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-mediumb mb-3 ${
                  product.inventory > 0
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
              </span>
            </div>
          )}

          {/* Short Description */}
          {product.shortDescription && (
            <div className="pt-1 border-t border-zinc-200">
              <p className="text-zinc-700 leading-relaxed text-base">{product.shortDescription}</p>
            </div>
          )}

          {/* Add to Cart Button (Placeholder) */}
          <div className="pt-2">
            <button
              disabled={isOutOfStock}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-base transition-colors ${
                isOutOfStock
                  ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          {/* Full Description */}
          {product.description && (
            <div className="pt-6 border-t border-zinc-200">
              <h2 className="text-xl font-bold text-zinc-900 mb-3">Product Details</h2>
              <div className="text-zinc-700 leading-relaxed">
                {(() => {
                  // Handle the specific JSON structure from the database
                  try {
                    // If it's already an object with the structure
                    if (typeof product.description === 'object' && product.description !== null) {
                      if (product.description.root && product.description.root.children) {
                        return product.description.root.children.map(
                          (block: any, blockIndex: number) => {
                            if (block.type === 'paragraph' && block.children) {
                              return (
                                <p key={blockIndex} className="mb-3 text-zinc-700">
                                  {block.children
                                    .map((textNode: any, textIndex: number) => textNode.text || '')
                                    .join('')}
                                </p>
                              )
                            }
                            return null
                          },
                        )
                      }
                    }
                    // Default fallback
                    return <p className="mb-3">{String(product.description)}</p>
                  } catch (error) {
                    console.error('Error rendering product description:', error)
                    return <p className="mb-3">Product description unavailable</p>
                  }
                })()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
