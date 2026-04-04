import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "react-hot-toast"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})
const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
})

// FIX – Open Graph: default metadata used for all pages unless overridden.
// Individual post pages should export their own `generateMetadata` to get
// post-specific OG images (see app/post/[slug]/page.js).
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blogverse.vercel.app'

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "BlogVerse – Write, Share, Earn",
    template: "%s | BlogVerse",
  },
  description: "A free community where anyone can write, share, and earn. No account needed. Start blogging today.",
  keywords: "blog, writing, community, free blogging platform, earn from writing",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "BlogVerse",
    title: "BlogVerse – Write, Share, Earn",
    description: "A free community where anyone can write, share, and earn. No account needed.",
    images: [
      {
        url: "/og-default.png",   // add a 1200×630 image at /public/og-default.png
        width: 1200,
        height: 630,
        alt: "BlogVerse – Write, Share, Earn",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogVerse – Write, Share, Earn",
    description: "A free community where anyone can write, share, and earn. No account needed.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lora.variable}`}>
      <body suppressHydrationWarning={true} className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
              },
              duration: 3000,
            }}
          />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
