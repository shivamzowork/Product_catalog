import Image from 'next/image'
import Link from 'next/link'
import type { Product } from '@/payload-types'
import { Package } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const image =
    Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null
  const imgSrc = typeof image === 'object' && image?.url ? image.url : ''

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden transition-all duration-200 hover:shadow-lg">
        {/* Image Container */}
        <div className="relative aspect-square bg-zinc-50">
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={typeof image === 'object' && image?.alt ? image.alt : product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <Package className="w-16 h-16 text-zinc-300 mb-2" />
              <span className="text-zinc-400 text-sm">No image</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Category */}
          {typeof product.category === 'object' && product.category?.title && (
            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
              {product.category.title}
            </p>
          )}

          {/* Product Title */}
          <h3 className="font-semibold text-lg text-zinc-900 mb-2 line-clamp-2">{product.title}</h3>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-sm text-zinc-600 mb-3 line-clamp-2">{product.shortDescription}</p>
          )}

          {/* Price and Stock */}
          <div className="flex items-center justify-between mt-4">
            {typeof product.price === 'number' && (
              <p className="text-2xl font-bold text-zinc-900">${product.price.toFixed(2)}</p>
            )}

            {/* Stock Status */}
            {typeof product.inventory === 'number' && (
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  product.inventory > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}
              >
                {product.inventory > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
