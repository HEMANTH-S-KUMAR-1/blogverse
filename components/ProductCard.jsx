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
    <div className="group flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
        {product.thumbnail_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img 
            src={product.thumbnail_url} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
            <span className="text-6xl transform transition-transform group-hover:scale-125 duration-300">
              {categoryEmoji[product.category] || '📦'}
            </span>
          </div>
        )}
        
        {product.category && (
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${categoryColorClasses[product.category] || 'bg-white text-gray-900'}`}>
              {product.category}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col p-6 flex-1">
        <h3 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight mb-2 group-hover:text-emerald-500 transition-colors">
          {product.title}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-6">
            {product.description}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-tight">Investment</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
              {product.price}
            </span>
          </div>
          
          <a
            href={product.gumroad_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-bold transition-all hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white shadow-lg active:scale-95"
          >
            Get It Now
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
