'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Laptop,
  Shirt,
  Home,
  BookOpen,
  ShoppingBag,
  Smartphone,
  Watch,
} from 'lucide-react'
import type { Category } from '@/payload-types'

interface CategoryCardProps {
  category: Category
}

// Icon mapping based on category slug
const categoryIcons: Record<string, any> = {
  electronics: Laptop,
  clothing: Shirt,
  'home-kitchen': Home,
  books: BookOpen,
  phone: Smartphone,
  laptop: Laptop,
  fashion: Shirt,
  accessories: Watch,
}

export function CategoryCard({ category }: CategoryCardProps) {
  const [productCount, setProductCount] = useState<number | null>(null)

  // Fetch product count for this category
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch(
          `/api/products?where[category][equals]=${category.id}&where[status][equals]=published&limit=0`,
        )
        const data = await res.json()
        setProductCount(data.totalDocs || 0)
      } catch (error) {
        console.error('Error fetching product count:', error)
      }
    }

    fetchCount()
  }, [category.id])

  // Get icon for category
  const IconComponent = categoryIcons[category.slug] || Package

  return (
    <Link href={`/categories/${category.slug}`} className="block">
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden p-6">
        {/* Icon */}
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>

        {/* Category Info */}
        <h3 className="text-xl font-bold text-zinc-900 mb-2">{category.title}</h3>

        {category.description && (
          <p className="text-sm text-zinc-600 mb-4 line-clamp-2 min-h-[2.5rem]">
            {category.description}
          </p>
        )}

        {/* Product Count Badge */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
          {productCount !== null ? (
            <span className="text-sm text-zinc-600">
              <span className="font-semibold text-zinc-900">{productCount}</span> products
            </span>
          ) : (
            <span className="text-sm text-zinc-400">Loading...</span>
          )}

          <span className="text-sm text-blue-600 font-medium">View →</span>
        </div>
      </div>
    </Link>
  )
}
