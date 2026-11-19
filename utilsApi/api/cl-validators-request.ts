import { CL_POST_MAX_IDS } from '@lidofinance/lido-csm-sdk';
import type { NextApiRequest } from 'next';

import type { ApiProxyRequest } from './apiProxyFactory';
import { InvalidRequestError } from './errors';

export const CL_VALIDATORS_METHOD = 'eth/v1/beacon/states/head/validators';

const PUBKEY_REGEXP = /^0x[0-9a-fA-F]{96}$/;
const INDEX_REGEXP = /^\d+$/;

const parseIds = (ids: unknown): string[] => {
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > CL_POST_MAX_IDS ||
    !ids.every(
      (id) =>
        typeof id === 'string' &&
        (PUBKEY_REGEXP.test(id) || INDEX_REGEXP.test(id)),
    )
  ) {
    throw new InvalidRequestError(
      `Validator ids must be 1-${CL_POST_MAX_IDS} pubkeys or indices`,
    );
  }
  return ids;
};

const parseBody = (body: unknown): unknown => {
  try {
    if (typeof body === 'string') return JSON.parse(body);
    if (Buffer.isBuffer(body)) return JSON.parse(body.toString());
  } catch {
    throw new InvalidRequestError('Request body is not valid JSON');
  }
  return body;
};

export const parseClValidatorsRequest = (
  req: NextApiRequest,
): ApiProxyRequest => {
  if (req.method === 'POST') {
    const body = parseBody(req.body);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      throw new InvalidRequestError('Request body is required');
    }
    const { ids, statuses } = body as { ids?: unknown; statuses?: unknown };
    const validIds = parseIds(ids);
    if (
      statuses !== undefined &&
      (!Array.isArray(statuses) ||
        !statuses.every((s) => typeof s === 'string'))
    ) {
      throw new InvalidRequestError('Statuses must be an array of strings');
    }
    return { params: {}, body: JSON.stringify({ ids: validIds, statuses }) };
  }

  const { id, status } = req.query;
  if (typeof id !== 'string' || !id) {
    throw new InvalidRequestError('Query param id is required');
  }
  parseIds(id.split(','));
  return {
    params: { id, ...(typeof status === 'string' && { status }) },
  };
};
