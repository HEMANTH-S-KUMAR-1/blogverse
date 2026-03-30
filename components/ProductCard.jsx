export default function ProductCard({ product }) {
  const categoryColorClasses = {
    health: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    tech: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    finance: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    student: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    business: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    eco: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  }

  const categoryEmoji = {
    health: '🌿', tech: '🤖', finance: '💰', student: '📚', business: '🚀', eco: '🌱',
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      {/* Thumbnail */}
      {product.thumbnail_url ? (
        <div className="aspect-video bg-gray-100 dark:bg-gray-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        </div>
      ) : (
        <div className="aspect-video bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
          <span className="text-5xl">{categoryEmoji[product.category] || '📦'}</span>
        </div>
      )}

      <div className="p-5">
        {product.category && (
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${categoryColorClasses[product.category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
            {product.category}
          </span>
        )}
        <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">{product.title}</h3>
        {product.description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{product.description}</p>
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{product.price}</span>
          <a
            href={product.gumroad_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-medium transition-all"
          >
            Buy Now
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      </div>
    </div>
  )
}
