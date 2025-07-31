import { FetcherError } from './fetcher-error';
import { StandardFetcher, extractError } from './standard-fetcher';

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
    throw new FetcherError(await extractError(response), response.status);
  }

  const text = await response.text();

  return JSON.parse(prepare(text));
};
