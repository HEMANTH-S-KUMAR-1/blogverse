'use client'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function SupportPage() {
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'your_upi_id_here'
  const kofiUsername = process.env.NEXT_PUBLIC_KOFI_USERNAME || 'your_kofi_username'

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId)
    toast.success('UPI ID copied to clipboard!')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Support BlogVerse</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
          Your support keeps this platform free and ad-light
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center max-w-md mx-auto shadow-xl">
        <div className="w-48 h-48 mx-auto rounded-xl overflow-hidden mb-6">
          <Image src="/upi-qr.png" alt="UPI QR Code" width={192} height={192} className="w-full h-full object-contain" />
        </div>
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">UPI ID</p>
          <button onClick={copyUpi} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <span className="font-mono text-gray-900 dark:text-white">{upiId}</span>
          </button>
        </div>
        <a href={"https://ko-fi.com/" + kofiUsername} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium transition-colors mb-4">
          Support on Ko-fi
        </a>
      </div>
      <div className="mt-8 text-center max-w-lg mx-auto">
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
          BlogVerse is free to use for everyone. Your generous support helps us keep the platform running and continue building features for the community.
        </p>
      </div>
    </div>
  )
}
