import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
import { SmSDK } from './web3-provider';

// Queried per module so one module's RPC failure cannot hide the others'
// results; only a total failure surfaces as a query error.
export const fetchAcrossModules = async <T>(
  sm: Partial<Record<MODULE_NAME, SmSDK>>,
  label: string,
  fetch: (sdk: SmSDK) => Promise<T[]>,
): Promise<(T & { module: MODULE_NAME })[]> => {
  const entries = deployedModules.flatMap((module) => {
    const sdk = sm[module];
    return sdk ? [{ module, sdk }] : [];
  });
  const settled = await Promise.allSettled(
    entries.map(({ sdk }) => fetch(sdk)),
  );

  if (
    settled.length > 0 &&
    settled.every((result) => result.status === 'rejected')
  ) {
    throw settled[0].reason;
  }

  return entries.flatMap(({ module }, index) => {
    const result = settled[index];
    if (result.status === 'rejected') {
      console.warn(`${module} ${label} failed`, result.reason);
      return [];
    }
    return result.value.map((item) => ({ ...item, module }));
  });
};
