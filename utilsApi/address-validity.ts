import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { config } from 'config';
import { FetcherError } from 'utils/fetcher-error';
import { standardFetcher } from 'utils/standard-fetcher';
import { responseTimeExternalMetricWrapper } from 'utilsApi/external-metrics';
import {
  isAddressDenied,
  isDenyListConfigured,
} from 'utilsApi/load-validation-file';
import { getServerConfig } from 'utilsApi/server-config';

const SERVICE_TIMEOUT_MS = 10_000;

export type AddressValidity =
  | { status: 'ok'; isValid: boolean }
  | { status: 'rate-limited' }
  | { status: 'unavailable' };

const checkService = async (
  baseUrl: string,
  address: string,
  clientHeaders: Record<string, string>,
): Promise<AddressValidity | null> => {
  const version = config.defaultChain === CHAINS.Mainnet ? 'v2' : 'v1';
  const url = `${baseUrl}/${version}/check/${address}`;
  // set() is case-insensitive, so forwarded headers can't override these
  const headers = new Headers(clientHeaders);
  headers.set('Accept', 'application/json');
  headers.set('Content-Type', 'application/json');

  try {
    const data = await responseTimeExternalMetricWrapper({
      target: baseUrl,
      route: 'validation',
      request: () =>
        standardFetcher<{ isValid?: unknown }>(url, {
          signal: AbortSignal.timeout(SERVICE_TIMEOUT_MS),
          headers,
        }),
    });
    if (typeof data?.isValid !== 'boolean') {
      throw new Error('unexpected service response');
    }
    return { status: 'ok', isValid: data.isValid };
  } catch (error) {
    if (error instanceof FetcherError && error.status === 429) {
      return { status: 'rate-limited' };
    }
    console.warn('[addressValidity] service check failed', error);
    return null;
  }
};

/** Service verdict wins, file is the fallback; address must be pre-validated (goes into the upstream URL). */
export const resolveAddressValidity = async (
  address: string,
  clientHeaders: Record<string, string>,
): Promise<AddressValidity> => {
  const { validationAPI } = getServerConfig();

  if (validationAPI) {
    const verdict = await checkService(validationAPI, address, clientHeaders);
    if (verdict) return verdict;
    if (!isDenyListConfigured()) return { status: 'unavailable' };
  }

  return { status: 'ok', isValid: !(await isAddressDenied(address)) };
};
