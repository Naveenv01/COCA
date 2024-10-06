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
  if (!results || results.length == 0) {
    return (
      <div className="text-gray-700 text-lg">
        No results found. Please try another search term.
      </div>
    );
  }

  // Calculate total frequency across all documents
  //
  const totalFrequency = results.reduce(
    (acc, group) => acc + group.totalFrequency,
    0,
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
        Search Results
      </h2>

      {/* Total Frequency Display */}
      <div className="text-lg font-semibold text-gray-700">
        Total Frequency of searched word:{" "}
        <span className="text-indigo-600">{totalFrequency}</span>
      </div>

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
            <div key={index} className="bg-white p-6 ">
              <p className="text-gray-800 leading-relaxed">
                <span
                  dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                />
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Word frequency in this document: {result.wordFrequency}
              </p>
              <hr className="my-4 border-gray-300" />
            </div>
          ))}
    </div>
  );
}
