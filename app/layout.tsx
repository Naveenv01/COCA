import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'COCA-like Search',
  description: 'A simple COCA-like search interface',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  )
}