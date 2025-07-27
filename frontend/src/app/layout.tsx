import type { Metadata } from 'next'
import { Poppins, Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
})

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-be-vietnam-pro",
})

export const metadata: Metadata = {
  title: 'MandiNow - Digital Committee for Local Buying',
  description: "India's Digital Committee for Local Buying - Connecting local vendors with suppliers",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${beVietnamPro.variable} bg-background text-foreground`}>
        <div className="w-full min-h-screen bg-surface card-shadow relative">
          {children}
        </div>
      </body>
    </html>
  )
}

