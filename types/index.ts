export interface SearchResult {
  id: string;
  text: string;
  fileName: string;
  score: number;
  highlightedText: string;
}

export interface AggregatedSearchResult {
  fileName: string;
  count: number;
  results: SearchResult[];
}

export type AggregatedSearchResults = AggregatedSearchResult[];