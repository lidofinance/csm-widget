import type { NextApiRequest, NextApiResponse } from 'next';
import { getRPCCheckState } from '../../scripts/startup-checks/rpc.mjs';

type RPCCheckResult = {
  domain: string;
  chainId: number;
  success: boolean;
};

type ChainSummary = { ok: number; total: number };

type StartingResponse = { status: 'starting' };
type MisconfiguredResponse = { status: 'misconfigured'; reason: string };
type ReadyResponse = {
  status: 'ready' | 'degraded';
  chains: Record<string, ChainSummary>;
};

type State = {
  started: boolean;
  resolved: boolean;
  result: RPCCheckResult[] | null;
  reason: string | null;
};

const summarize = (results: RPCCheckResult[]): Record<string, ChainSummary> => {
  const chains: Record<string, ChainSummary> = {};
  for (const { chainId, success } of results) {
    const key = String(chainId);
    const bucket = chains[key] ?? (chains[key] = { ok: 0, total: 0 });
    bucket.total += 1;
    if (success) bucket.ok += 1;
  }
  return chains;
};

const ready = (
  _req: NextApiRequest,
  res: NextApiResponse<
    StartingResponse | MisconfiguredResponse | ReadyResponse
  >,
) => {
  res.setHeader('Cache-Control', 'no-store');

  const { started, resolved, result, reason }: State = getRPCCheckState();

  if (!started || !resolved) {
    res.status(503).json({ status: 'starting' });
    return;
  }

  if (result === null) {
    res.status(503).json({
      status: 'misconfigured',
      reason: reason ?? 'unknown',
    });
    return;
  }

  const chains = summarize(result);
  const degraded = Object.values(chains).some((c) => c.ok === 0);

  res.status(degraded ? 503 : 200).json({
    status: degraded ? 'degraded' : 'ready',
    chains,
  });
};

export default ready;
