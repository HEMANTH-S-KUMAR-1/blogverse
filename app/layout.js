import { Inter, Lora } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "react-hot-toast"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
})

export const metadata = {
  title: "BlogVerse — Write, Share, Earn",
  description: "A free community where anyone can write, share, and earn. No account needed. Start blogging today.",
  keywords: "blog, writing, community, free blogging platform, earn from writing",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${lora.variable}`}>
      <body className="bg-background text-foreground transition-colors duration-300 min-h-screen flex flex-col antialiased">
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
      </body>
    </html>
  )
}
