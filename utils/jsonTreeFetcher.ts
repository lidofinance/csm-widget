import { FetcherError } from './fetcherError';
import { StandardFetcher, extractError } from './standardFetcher';

const DEFAULT_PARAMS = {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
};

const prepare = (text: string) => {
  return text.replace(
    /"value"\s*:\s*\[(\d+)\s*,\s*(\d+)\]/g,
    '"value":["$1","$2"]',
  );
};

export const jsonTreeFetcher: StandardFetcher = async (url, params) => {
  const response = await fetch(url, {
    ...DEFAULT_PARAMS,
    ...params,
  });

  if (!response.ok) {
    throw new FetcherError(await extractError(response), response.status);
  }

  const text = await response.text();

  return JSON.parse(prepare(text));
};
