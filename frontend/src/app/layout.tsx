import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mandipur',
  description: "India's Digital Committee for Local Buying",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <div className="max-w-lg md:max-w-7xl mx-auto bg-white min-h-screen shadow-2xl relative">
          {children}
        </div>
      </body>
    </html>
  )
}
