import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

// The primary module (MODULE env) is always deployed; only these secondary
// modules are gated by the availability table below.
const SECONDARY_MODULES: Partial<Record<MODULE_NAME, MODULE_NAME[]>> = {
  [MODULE_NAME.CSM]: [MODULE_NAME.CSM_02],
};

// Updating this table (plus an SDK bump) is the whole per-network rollout.
const MODULE_AVAILABILITY: Partial<Record<MODULE_NAME, number[]>> = {
  [MODULE_NAME.CSM_02]: [CHAINS.Hoodi],
};

export const resolveDeployedModules = (
  primary: MODULE_NAME,
  chainId: number,
): MODULE_NAME[] => [
  primary,
  ...(SECONDARY_MODULES[primary] ?? []).filter((module) =>
    (MODULE_AVAILABILITY[module] ?? []).includes(chainId),
  ),
];
