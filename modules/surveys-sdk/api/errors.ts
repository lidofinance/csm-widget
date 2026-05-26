import { FetcherError } from 'utils/fetcher-error';

export class SurveysApiError extends Error {
  readonly status: number;
  readonly url: string;
  readonly body?: unknown;
  readonly cause?: unknown;

  constructor(opts: {
    message: string;
    status: number;
    url: string;
    body?: unknown;
    cause?: unknown;
  }) {
    super(opts.message);
    this.name = 'SurveysApiError';
    this.status = opts.status;
    this.url = opts.url;
    this.body = opts.body;
    this.cause = opts.cause;
  }
}

export const isAuthError = (err: unknown): boolean => {
  if (err instanceof SurveysApiError) {
    return err.status === 401 || err.status === 403;
  }
  if (err instanceof FetcherError) {
    return err.status === 401 || err.status === 403;
  }
  return false;
};
