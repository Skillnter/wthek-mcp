/**
 * Result structure returned when looking up an HTTP status code.
 * @interface
 */
export interface IHttpStatusLookupResult {
  className?: string;
  code: number;
  description: string;
  exampleSnippet: string;
  isClientError: boolean;
  isServerError: boolean;
  name: string;
  recommendedHeaders: string[];
  rfcStandardUrl: string;
}

