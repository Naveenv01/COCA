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
      <body className="flex flex-col min-h-screen">
        <nav className="bg-indigo-800 text-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold">COCA-like Search</h1>
          </div>
        </nav>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-indigo-800 text-white py-4 mt-8">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2023 COCA-like Search. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}