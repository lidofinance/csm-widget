import ms from 'ms';

export const CACHE_ETH_PRICE_KEY = 'cache-eth-price';
export const CACHE_ETH_PRICE_TTL = ms('1m');
export const CACHE_ETH_PRICE_HEADERS =
  'public, max-age=60, stale-if-error=1200, stale-while-revalidate=30';

export const CACHE_ETHSEER_RATE_KEY = 'cache-ethseer-rate';
export const CACHE_ETHSEER_RATE_TTL = ms('3m');
export const CACHE_ETHSEER_RATE_HEADERS =
  'public, max-age=180, stale-if-error=1200, stale-while-revalidate=30';

export const CACHE_DEFAULT_HEADERS =
  'public, max-age=180, stale-if-error=1200, stale-while-revalidate=60';
