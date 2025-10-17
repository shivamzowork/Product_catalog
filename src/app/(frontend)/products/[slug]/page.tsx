import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/action/product.action'
import { ProductDetail } from '@/components/products/ProductDetails'
import { Container } from '@/components/ui/Container'

export const revalidate = 60

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { product } = await getProductBySlug(slug)

  if (!product) return notFound()
  return (
    <main className="bg-white min-h-screen">
      <Container>
        <div className="py-8">
          <ProductDetail product={product} />
        </div>
      </Container>
    </main>
  )
}
