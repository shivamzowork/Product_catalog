'use client'

import { useEffect, useState } from 'react'
import { CategoryCard } from '@/components/categories/CategoryCard'
import { Container } from '@/components/ui/Container'
import { Search, X } from 'lucide-react'
import type { Category } from '@/payload-types'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories?limit=100')
        const data = await res.json()
        setCategories(data.docs || [])
        setFilteredCategories(data.docs || [])
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Search filter
  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.filter(
        (category) =>
          category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredCategories(filtered)
    } else {
      setFilteredCategories(categories)
    }
  }, [categories, searchQuery])

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <div className="bg-blue-600 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Browse Categories</h1>
          </div>
        </div>
        <Container>
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-zinc-600">Loading categories...</p>
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
          <h1 className="text-4xl font-bold text-white">Browse Categories</h1>
        </div>
      </div>

      <Container>
        <div className="py-8">
          {/* Search and Count Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            {/* Category Count */}
            <div>
              <p className="text-sm text-zinc-600">
                Showing{' '}
                <span className="font-semibold text-zinc-900">{filteredCategories.length}</span> of{' '}
                <span className="font-semibold text-zinc-900">{categories.length}</span> categories
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
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

          {/* Categories Grid */}
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-50 rounded-lg">
              <p className="text-lg text-zinc-600 mb-4">No categories found</p>
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </Container>
    </main>
  )
}
