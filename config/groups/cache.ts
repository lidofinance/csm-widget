import ms from 'ms';

export const CACHE_MIGALABS_RATE_KEY = 'cache-migalabs-rate';
export const CACHE_MIGALABS_RATE_TTL = ms('3m');
export const CACHE_MIGALABS_RATE_HEADERS =
  'public, max-age=180, stale-if-error=1200, stale-while-revalidate=30';

export const CACHE_DEFAULT_HEADERS =
  'public, max-age=180, stale-if-error=1200, stale-while-revalidate=60';
export const CACHE_VALIDATION_HEADERS =
  'public, max-age=30, stale-if-error=1200, stale-while-revalidate=30';
