import Link from 'next/link'
import { getProducts } from '@/action/product.action'
import { getCategories } from '@/action/category.action'
import { ProductGrid } from '@/components/products/ProductGrid'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import {
  ShoppingBag,
  TrendingUp,
  Shield,
  Truck,
  ArrowRight,
  Star,
  Users,
  Package,
} from 'lucide-react'

export const revalidate = 60

export default async function HomePage() {
  const { products } = await getProducts({ limit: 8 })
  const { categories } = await getCategories()

  return (
    <main className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative bg-blue-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>

        <Container>
          <div className="relative py-20 md:py-28 text-center">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Discover Amazing
              <br />
              <span className="">Products You'll Love</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-blue-100 mx-center leading-relaxed mb-8 m-3">
              Shop the latest trends with unbeatable prices. Quality products, fast shipping, and
              exceptional service.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-lg px-8"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-blue-700 hover:bg-white hover:text-blue-700 transition-all text-lg px-8"
                >
                  Browse Categories
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-200 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-200 text-sm">Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">4.9</div>
                <div className="text-blue-200 text-sm flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white border-b border-zinc-200">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-zinc-900 font-semibold text-lg mb-1">Free Shipping</h3>
                <p className="text-zinc-600 text-sm !m-0">On orders over $50</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-zinc-900 font-semibold text-lg mb-1">Secure Payment</h3>
                <p className="text-zinc-600 text-sm !m-0">100% secure transactions</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-zinc-900 font-semibold text-lg mb-1">24/7 Support</h3>
                <p className="text-zinc-600 text-sm !m-0">Dedicated customer service</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-zinc-50">
          <Container>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">
                  Shop by Category
                </h2>
                <p className="text-zinc-600">Find exactly what you're looking for</p>
              </div>
              <Link
                href="/categories"
                className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category: any, index: number) => {
                const colors = [
                  'from-blue-500 to-blue-600',
                  'from-purple-500 to-purple-600',
                  'from-green-500 to-green-600',
                  'from-orange-500 to-orange-600',
                ]
                const bgColor = colors[index % colors.length]

                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="relative overflow-hidden rounded-2xl shadow-md"
                  >
                    <div
                      className={`bg-gradient-to-br ${bgColor} p-8 text-white h-48 flex flex-col justify-between`}
                    >
                      <div>
                        <Package className="w-10 h-10 mb-4 opacity-80" />
                        <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                        {category.description && (
                          <p className="text-sm text-white/80 line-clamp-2">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        Shop Now
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="md:hidden mt-6 text-center">
              <Link href="/categories">
                <Button variant="outline" className="w-full sm:w-auto">
                  View All Categories
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Featured Products Section */}
      {products.length > 0 && (
        <section className="py-16 bg-white">
          <Container>
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">
                  Featured Products
                </h2>
                <p className="text-zinc-600">Handpicked favorites just for you</p>
              </div>
              <Link
                href="/products"
                className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors group"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <ProductGrid products={products} />

            <div className="mt-10 text-center">
              <Link href="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Browse All Products
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
            <p className="text-blue-100 text-lg mb-8">
              Subscribe to our newsletter for exclusive deals, new arrivals, and special offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-lg text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-blue-200 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </Container>
      </section>
    </main>
  )
}
