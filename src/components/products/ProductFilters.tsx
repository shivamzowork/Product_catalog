'use client'

import { Search, X } from 'lucide-react'

interface ProductFiltersProps {
  categories: Array<{ id: number; title: string; slug: string }>
  selectedCategory: string
  searchQuery: string
  sortBy: string
  onCategoryChange: (slug: string) => void
  onSearchChange: (query: string) => void
  onSortChange: (sort: string) => void
}

export function ProductFilters({
  categories,
  selectedCategory,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
      {/* Category Filter - First */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === ''
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.slug)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.slug
                ? 'bg-blue-600 text-white'
                : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
            }`}
          >
            {category.title}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        {/* Sort Dropdown - Second */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-900 whitespace-nowrap">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-zinc-900"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Search Bar - Third */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-zinc-900 placeholder:text-zinc-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
