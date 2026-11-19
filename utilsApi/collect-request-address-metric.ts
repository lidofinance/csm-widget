import type { Counter } from 'prom-client';
import { getAddress, isAddress } from 'viem';

import type { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

import {
  METRIC_CONTRACT_ADDRESSES,
  getMetricContractAbi,
} from './contractAddressesMetricsMap';
import { getFunctionNameFromAbi } from './get-function-name-from-abi';

const LOG_ERROR_MAX_LENGTH = 200;
// `slice(0, 10)` on an array returns 10 elements, so match the selector shape
// instead of trusting a bare length check.
const METHOD_SELECTOR = /^0x[0-9a-fA-F]{8}$/;

// Parser errors can quote their whole input, so keep log lines bounded.
const shortError = (error: unknown) => {
  const text =
    error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return text.length > LOG_ERROR_MAX_LENGTH
    ? `${text.slice(0, LOG_ERROR_MAX_LENGTH)}…`
    : text;
};

export const collectRequestAddressMetric = ({
  calls,
  chainId,
  metrics,
}: {
  calls: any[];
  chainId: SUPPORTED_CHAINS;
  metrics: Counter<string>;
}) => {
  let invalidSelectors = 0;
  let malformedCalls = 0;
  let lastMalformedError = '';

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

      if (typeof to !== 'string' || !isAddress(to, { strict: false })) {
        malformedCalls++;
        return;
      }

      const address = getAddress(to);
      const contractName = METRIC_CONTRACT_ADDRESSES?.[chainId]?.[address];

      const selector = typeof data === 'string' ? data.slice(0, 10) : '';
      const validSelector = METHOD_SELECTOR.test(selector);
      if (!validSelector) invalidSelectors++;

      // Raw selector is a label only when it decodes against a known ABI,
      // otherwise callers could mint unbounded label sets.
      let methodEncoded = 'N/A';
      let methodDecoded = 'N/A';
      if (contractName && validSelector) {
        try {
          const abi = getMetricContractAbi(contractName);
          if (!abi) {
            console.warn(`ABI not found for contract: ${contractName}`);
          } else {
            const functionName = getFunctionNameFromAbi(abi, selector);
            if (functionName) {
              methodEncoded = selector;
              methodDecoded = functionName;
            }
          }
        } catch (error) {
          console.warn(
            `[collectRequestAddressMetric] failed to decode ${selector} method for ${contractName}: ${shortError(
              error,
            )}`,
          );
        }
      }

      metrics
        .labels({
          address: contractName ? address : 'N/A',
          contractName: contractName || 'N/A',
          methodEncoded,
          methodDecoded,
        })
        .inc(1);
    } catch (error) {
      malformedCalls++;
      lastMalformedError = shortError(error);
    }
  });

  if (invalidSelectors > 0 || malformedCalls > 0) {
    const errorSuffix = lastMalformedError ? `: ${lastMalformedError}` : '';
    console.warn(
      `[collectRequestAddressMetric] skipped ${malformedCalls} malformed calls, ${invalidSelectors} invalid selectors in batch of ${calls.length}${errorSuffix}`,
    );
  }
};
