'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/products/ProductCard'
import { Search, X } from 'lucide-react'
import type { Category, Product } from '@/payload-types'

interface CategoryDetailPageProps {
  params: {
    slug: string
  }
}

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [loading, setLoading] = useState(true)

  // Fetch category and its products
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch category
        const categoryRes = await fetch(`/api/categories?where[slug][equals]=${params.slug}`)
        const categoryData = await categoryRes.json()
        const category = categoryData.docs[0]

        if (!category) {
          notFound()
          return
        }

        setCategory(category)

        // Fetch products for this category
        const productsRes = await fetch(
          `/api/products?where[category][equals]=${category.id}&where[status][equals]=published&depth=1`,
        )
        const productsData = await productsRes.json()
        setProducts(productsData.docs || [])
        setFilteredProducts(productsData.docs || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  // Apply search and sort
  useEffect(() => {
    let result = [...products]

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.title.localeCompare(b.title)
        case 'name-desc':
          return b.title.localeCompare(a.title)
        case 'price-asc':
          return (a.price || 0) - (b.price || 0)
        case 'price-desc':
          return (b.price || 0) - (a.price || 0)
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }, [products, searchQuery, sortBy])

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="bg-blue-600 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Loading...</h1>
          </div>
        </div>
        <Container>
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Container>
      </main>
    )
  }

  if (!category) return null

  return (
    <main className="bg-white min-h-screen">
      {/* Banner */}
      <div className="bg-blue-600 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">{category.title}</h1>
          {category.description && (
            <p className="text-blue-100 text-lg mx-auto m-0">{category.description}</p>
          )}
        </div>
      </div>

      <Container>
        <div className="py-8">
          {/* Search and Sort Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            {/* Product Count */}
            <div>
              <p className="text-sm text-zinc-600">
                Showing{' '}
                <span className="font-semibold text-zinc-900">{filteredProducts.length}</span> of{' '}
                <span className="font-semibold text-zinc-900">{products.length}</span> products
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-zinc-900 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-zinc-900"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-zinc-900 placeholder:text-zinc-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-50 rounded-lg">
              <p className="text-lg text-zinc-600 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSortBy('name-asc')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}
