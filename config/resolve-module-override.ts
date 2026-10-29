import {
  MODULE_CONFIG,
  MODULE_NAME,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';

import { DEPLOYMENT_MODULES } from 'consts/modules/resolve-deployed-modules';

export const getOverridableModules = (
  chainId: SUPPORTED_CHAINS,
): MODULE_NAME[] =>
  DEPLOYMENT_MODULES.filter((m) => MODULE_CONFIG[m]?.[chainId]);

export const resolveModuleOverride = (
  candidate: unknown,
  chainId: SUPPORTED_CHAINS,
): MODULE_NAME | undefined => {
  if (typeof candidate !== 'string') return undefined;
  const name = candidate.trim().toUpperCase();
  return getOverridableModules(chainId).find((m) => m === name);
};
