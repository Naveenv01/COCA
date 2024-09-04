'use client'

import { useState } from 'react'
import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'

import { SearchResult } from '../types'
import FileUpload from './components/FIleUpload'

export default function Home() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string) => {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    const data = await response.json()
    setResults(data)
    setHasSearched(true)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <div className="max-w-3xl mx-auto">
          {hasSearched ? (
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-500 mr-8">COCA-like Search</h1>
              <SearchForm onSearch={handleSearch} />
            </div>
          ) : (
            <h1 className="text-5xl font-bold text-center text-blue-500 mb-8">COCA-like Search</h1>
          )}
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4">
          {!hasSearched && <SearchForm onSearch={handleSearch} />}
          <SearchResults results={results} />
          <FileUpload />
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-gray-500">
        © 2023 COCA-like Search. All rights reserved.
      </footer>
    </div>
  )
}