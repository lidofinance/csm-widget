import type { NextApiRequest, NextApiResponse } from 'next';

type ReadyResponse = { status: 'ready' };

// Readiness must reflect only this pod's health. Upstream RPC status is deliberately
// excluded: it is identical across all replicas, so failing on it would drain the
// whole deployment instead of degrading.
const ready = (_req: NextApiRequest, res: NextApiResponse<ReadyResponse>) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ready' });
};

export default ready;
