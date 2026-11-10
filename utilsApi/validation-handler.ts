import type { NextApiRequest, NextApiResponse } from 'next';
import { isAddress } from 'viem';

import { resolveAddressValidity } from 'utilsApi/address-validity';
import { getClientRequestHeaders } from 'utilsApi/client-request-headers';

const validateEthereumAddress = (address: unknown): string | null => {
  if (typeof address !== 'string') return null;
  if (!isAddress(address)) return null;

  return address.toLowerCase();
};

export const validationHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const address = validateEthereumAddress(req.query.address);

  if (!address) {
    res.status(400).json({
      error: 'Invalid Ethereum address',
      message: 'Address must be a valid Ethereum address format',
    });
    return;
  }

  const result = await resolveAddressValidity(
    address,
    getClientRequestHeaders(req),
  );

  if (result.status === 'rate-limited') {
    res.status(429).json({ error: 'Validation service rate limit' });
    return;
  }

  if (result.status === 'unavailable') {
    res.status(503).json({ error: 'Address validation unavailable' });
    return;
  }

  res.status(200).json({ isValid: result.isValid });
};
