import { extractErrorMessage } from 'utils';
import { FetcherError } from './fetcher-error';

const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
};

export const extractError = async (response: Response) => {
  try {
    const error = await response.json();
    return extractErrorMessage(error) ?? 'An error occurred';
  } catch (error) {
    return 'An error occurred while fetching the data';
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
    throw new FetcherError(await extractError(response), response.status);
  }

  return await response.json();
};
