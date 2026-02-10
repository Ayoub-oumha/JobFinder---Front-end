export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  publishDate: string;
  description: string;
  url: string;
  salary: string | null;
  apiSource: string;
}

export interface JobSearchParams {
  keyword: string;
  location: string;
  page: number;
  resultsPerPage: number;
}

export interface JobSearchResult {
  jobs: Job[];
  totalResults: number;
  currentPage: number;
  resultsPerPage: number;
}
