import { getDB } from '@/lib/d1'
import ProductCard from '@/components/ProductCard'

export const metadata = {
  title: 'Digital Products — BlogVerse',
  description: 'Guides, templates, and resources from the BlogVerse community.',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const db = await getDB()
  const { results: products } = await db.prepare("SELECT * FROM digital_products ORDER BY created_at DESC").all()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Digital Downloads</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Guides, templates, and resources from our community</p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-400 text-lg">No products available yet. Check back soon!</p>
        </div>
      )}
    </div>
  )
}
