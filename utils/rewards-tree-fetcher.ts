import { extractErrorMessage } from './extract-error-message';
import { FetcherError } from './fetcher-error';
import type { StandardFetcher } from './standard-fetcher';

const DEFAULT_PARAMS = {
  method: 'GET',
};

const prepare = (text: string) => {
  return text.replace(
    /"value"\s*:\s*\[\s*(\d+)\s*,\s*(\d+)\s*\]/gm,
    '"value":["$1","$2"]',
  );
};

export const rewardsTreeFetcher: StandardFetcher = async (url, params) => {
  const response = await fetch(url, {
    ...DEFAULT_PARAMS,
    ...params,
  });

  if (!response.ok) {
    let message = 'An error occurred while fetching the data';
    try {
      const body = await response.json();
      message = extractErrorMessage(body) ?? 'An error occurred';
    } catch {
      // keep default message
    }
    throw new FetcherError(message, response.status);
  }

  const text = await response.text();

  return JSON.parse(prepare(text));
};
