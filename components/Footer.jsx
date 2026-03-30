import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                BlogVerse
              </span>
            </Link>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              A free community where anyone can write, share, and earn.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link href="/write" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Write a Post</Link></li>
              <li><Link href="/jobs" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Jobs Board</Link></li>
              <li><Link href="/products" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Digital Products</Link></li>
              <li><Link href="/courses" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Courses & Webinars</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/advertise" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Advertise</Link></li>
              <li><Link href="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Support Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Share</h3>
            <div className="flex gap-3">
              <a
                href="https://api.whatsapp.com/send?text=Check%20out%20BlogVerse%20-%20A%20free%20community%20blogging%20platform!%20https://blogverse.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center text-green-500 transition-colors"
                aria-label="Share on WhatsApp"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a
                href="https://twitter.com/intent/tweet?text=Check%20out%20BlogVerse%20-%20A%20free%20community%20blogging%20platform!&url=https://blogverse.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 flex items-center justify-center text-sky-500 transition-colors"
                aria-label="Share on Twitter"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            © {new Date().getFullYear()} BlogVerse. Built for the community, by the community.
          </p>
        </div>
      </div>
    </footer>
  )
}
