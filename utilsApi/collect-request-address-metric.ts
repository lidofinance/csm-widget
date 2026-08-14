import type { Counter } from 'prom-client';
import { getAddress } from 'viem';

import type { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

import {
  METRIC_CONTRACT_ADDRESSES,
  getMetricContractAbi,
} from './contractAddressesMetricsMap';
import { getFunctionNameFromAbi } from './get-function-name-from-abi';

const ADDRESS_LENGTH = 42; // '0x' + 40 hex chars
const LOG_ERROR_MAX_LENGTH = 200;
// `data` is unvalidated JSON, and whatever survives becomes a Prometheus label
// that prom-client retains forever. An array of long strings passes a bare
// `.slice(0, 10).length === 10` check, so match the selector shape instead.
const METHOD_SELECTOR = /^0x[0-9a-fA-F]{8}$/;

// Parser errors can quote their whole input, so keep log lines bounded.
const shortError = (error: unknown) => {
  const text =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return text.length > LOG_ERROR_MAX_LENGTH
    ? `${text.slice(0, LOG_ERROR_MAX_LENGTH)}…`
    : text;
};

const parseRefererUrl = (referer: string) => {
  if (!referer) return null;
  try {
    const url = new URL(referer);
    return `${url.origin}${url.pathname}`;
  } catch (error) {
    return null;
  }
};

export const collectRequestAddressMetric = async ({
  calls,
  referer,
  chainId,
  metrics,
}: {
  calls: any[];
  referer: string;
  chainId: SUPPORTED_CHAINS;
  metrics: Counter<string>;
}) => {
  const refererUrlParsed = parseRefererUrl(referer);
  calls.forEach((call: any) => {
    try {
      if (
        typeof call !== 'object' ||
        call.method !== 'eth_call' ||
        !call.params?.[0]?.to
      ) {
        return;
      }

      const { to, data } = call.params[0];

      // Metrics collection is independent of the route's own checks, so verify
      // the shape here rather than assuming a well-formed address.
      if (typeof to !== 'string' || to.length !== ADDRESS_LENGTH) return;

      const address = getAddress(to);
      const contractName = METRIC_CONTRACT_ADDRESSES?.[chainId]?.[address];
      const methodEncoded =
        typeof data === 'string' ? data.slice(0, 10) : undefined; // `0x` and 8 next symbols

      let methodDecoded = 'N/A';
      if (!methodEncoded || !METHOD_SELECTOR.test(methodEncoded)) {
        console.warn(`Invalid methodEncoded: ${methodEncoded}`);
      } else if (contractName) {
        // Scoped so a decode failure still records the call as 'N/A' rather
        // than dropping the metric entirely.
        try {
          const abi = getMetricContractAbi(contractName);
          if (!abi) {
            console.warn(`ABI not found for contract: ${contractName}`);
          } else {
            const functionName = getFunctionNameFromAbi(abi, methodEncoded);
            methodDecoded = functionName || 'Unknown Function';
          }
        } catch (error) {
          console.warn(
            `[collectRequestAddressMetric] failed to decode ${methodEncoded} method for ${contractName}: ${shortError(
              error,
            )}`,
          );
        }
      }

      metrics
        .labels({
          address,
          referer: refererUrlParsed || 'N/A',
          contractName: contractName || 'N/A',
          methodEncoded: methodEncoded || 'N/A',
          methodDecoded: methodDecoded || 'N/A',
        })
        .inc(1);
    } catch (error) {
      console.warn(
        `[collectRequestAddressMetric] skipping malformed call: ${shortError(
          error,
        )}`,
      );
    }
  });
};
