import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { config } from 'config';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getReadiness } from '../../scripts/readiness.mjs';

type ReadyResponse =
  { status: 'ready' } | { status: 'not-ready'; reason?: string };

// Readiness = this pod's lifecycle only; RPC status is excluded since it is shared
// across replicas and failing on it would drain the whole deployment
const ready = (_req: NextApiRequest, res: NextApiResponse<ReadyResponse>) => {
  const { ready: isReady, reason } = getReadiness();
  if (isReady) {
    res.status(200).json({ status: 'ready' });
  } else {
    res.status(503).json({ status: 'not-ready', reason });
  }
};

export default wrapNextRequest([
  cacheControl({ headers: config.CACHE_NO_STORE_HEADERS }),
])(ready);
