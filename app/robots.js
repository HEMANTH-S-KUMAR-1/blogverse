export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogverse.pages.dev'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/_next/', '/edit/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
