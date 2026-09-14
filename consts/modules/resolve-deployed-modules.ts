import {
  MODULE_CONFIG,
  MODULE_NAME,
  PerModule,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';

// Which modules a deployment ships. Primary first; the primary always constructs.
const MODULE_SET: PerModule<MODULE_NAME[]> = {
  [MODULE_NAME.CSM]: [MODULE_NAME.CSM, MODULE_NAME.CSM_02],
  [MODULE_NAME.CSM_02]: [MODULE_NAME.CSM_02],
  [MODULE_NAME.CM]: [MODULE_NAME.CM],
};

export const resolveDeployedModules = (primary: MODULE_NAME, chainId: number) =>
  MODULE_SET[primary].filter(
    (module) =>
      module === primary || MODULE_CONFIG[module][chainId as SUPPORTED_CHAINS],
  );
