import React, { useState, useEffect } from "react";
import { AggregatedSearchResults } from "../../types";

interface SearchResultsProps {
  results: AggregatedSearchResults;
}

export default function SearchResults({ results }: SearchResultsProps) {
  const [activeTab, setActiveTab] = useState<string | null>(null);

  useEffect(() => {
    // Set the active tab to the first result's fileName when results change
    if (results.length > 0 && activeTab === null) {
      setActiveTab(results[0].fileName);
    }
  }, [results, activeTab]);

  if (results.length === 0) {
    return null;
  }
  console.log(JSON.stringify(results));

  return (
    <div className="space-y-6 ">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
        Search Results
      </h2>

      {/* Tab Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {results.map((fileGroup) => (
          <button
            key={fileGroup.fileName}
            className={`px-4 py-2 rounded-t-lg font-medium ${
              activeTab === fileGroup.fileName
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab(fileGroup.fileName)}
          >
            {fileGroup.fileName} ({fileGroup.count})
          </button>
        ))}
      </div>

      {/* Results for Active Tab */}
      {activeTab &&
        results
          .find((group) => group.fileName === activeTab)
          ?.results.map((result, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200"
            >
              <p className="text-gray-800 leading-relaxed">
                <span
                  dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                />
              </p>
            </div>
          ))}
    </div>
  );
}
