import { SearchResult } from '../../types'

interface SearchResultsProps {
  results: SearchResult[]
}

export default function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-4">Search Results</h2>
      {results.map((result, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200">
          <p className="text-gray-800 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: result.highlightedText }} />
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Score: {result.score.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}