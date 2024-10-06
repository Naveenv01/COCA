export interface SearchResult {
  id: string;
  text: string;
  fileName: string;
  score: number;
  highlightedText: string;
  wordFrequency?: number;
}

export interface AggregatedSearchResult {
  fileName: string;
  count: number;
  totalFrequency: number;
  results: SearchResult[];
}

export type AggregatedSearchResults = AggregatedSearchResult[];
