'use client'

import { useEffect, useState } from 'react'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductFilters } from '@/components/products/ProductFilters'
import { Container } from '@/components/ui/Container'
import type { Product, Category } from '@/payload-types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?where[status][equals]=published&limit=100&depth=1'),
          fetch('/api/categories?limit=100'),
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        setProducts(productsData.docs || [])
        setCategories(categoriesData.docs || [])
        setFilteredProducts(productsData.docs || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Apply filters and sorting
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

    // Category filter
    if (selectedCategory) {
      result = result.filter((product) => {
        const category = typeof product.category === 'object' ? product.category : null
        return category?.slug === selectedCategory
      })
    }

    // Sorting
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
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    setFilteredProducts(result)
  }, [products, searchQuery, selectedCategory, sortBy])

  if (loading) {
    return (
      <main className="py-8 bg-white min-h-screen">
        <Container>
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-600">Loading products...</p>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      {/* Simple Banner */}
      <div className="bg-blue-600 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Our Products</h1>
        </div>
      </div>

      <Container>
        <div className="py-8">
          {/* Filters */}
          <ProductFilters
            categories={categories}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            sortBy={sortBy}
            onCategoryChange={setSelectedCategory}
            onSearchChange={setSearchQuery}
            onSortChange={setSortBy}
          />

          {/* Product Count */}
          <div className="mb-6">
            <p className="text-sm text-zinc-600">
              Showing <span className="font-semibold text-zinc-900">{filteredProducts.length}</span>{' '}
              of <span className="font-semibold text-zinc-900">{products.length}</span> products
            </p>
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
                  setSelectedCategory('')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}
