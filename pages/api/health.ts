import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { health } from '@lidofinance/next-pages';
import { config } from 'config';

export default wrapNextRequest([
  cacheControl({ headers: config.CACHE_NO_STORE_HEADERS }),
])(health);
