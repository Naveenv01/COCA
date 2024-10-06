"use client";
import { useState } from "react";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import { AggregatedSearchResults } from "../types";
// import FileUpload from "./components/FileUpload";

export default function Home() {
  const [results, setResults] = useState<AggregatedSearchResults>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const handleSearch = async (query: string) => {
    setLoading(true); // Set loading to true when search starts
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false); // Set loading to false when search ends
      setHasSearched(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-blue-500 mb-2">
            Search
          </h1>
        </div>
      </header>
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4">
          <div className="sticky top-0 bg-white z-10 py-2">
            <SearchForm onSearch={handleSearch} />
            {/* <FileUpload /> */}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="loader"></div>
            </div>
          ) : (
            <SearchResults results={results} />
          )}
        </div>
      </main>
      <footer className="p-4 text-center text-sm text-gray-500">
        © 2024 falconnave. All rights reserved.
      </footer>
    </div>
  );
}
