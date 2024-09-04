'use client'

import { useState } from 'react'
import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'
import { SearchResult } from '../types'

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([])

  const handleSearch = async (query: string) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    setResults(data)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center text-indigo-800">COCA-like Search</h1>
        <div className="max-w-2xl mx-auto">
          <SearchForm onSearch={handleSearch} />
          <SearchResults results={results} />
        </div>
      </main>
    </div>
  )
}