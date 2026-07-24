export class FetcherError extends Error {
  status: number;
  // Raw parsed JSON body of the failed response, when available. Survey API
  // responses carry the ApiError envelope here; other endpoints may not.
  body?: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}
