import { extractErrorMessage } from './extract-error-message';
import { FetcherError } from './fetcher-error';

const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
};

// Parse the error body once: return both a display message and the raw body so
// the FetcherError can carry the full ApiError envelope downstream.
const readError = async (
  response: Response,
): Promise<{ message: string; body: unknown }> => {
  try {
    const body = await response.json();
    return { message: extractErrorMessage(body) ?? 'An error occurred', body };
  } catch {
    return {
      message: 'An error occurred while fetching the data',
      body: undefined,
    };
  }
};

export type StandardFetcher = <T>(
  url: string,
  params?: RequestInit,
) => Promise<T>;

export const standardFetcher: StandardFetcher = async (url, params) => {
  const response = await fetch(url, {
    ...DEFAULT_PARAMS,
    ...params,
  });

  if (!response.ok) {
    const { message, body } = await readError(response);
    throw new FetcherError(message, response.status, body);
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    return undefined as never;
  }

  return await response.json();
};
