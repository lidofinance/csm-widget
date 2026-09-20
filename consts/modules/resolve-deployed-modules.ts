import {
  MODULE_CONFIG,
  MODULE_NAME,
  SUPPORTED_CHAINS,
} from '@lidofinance/lido-csm-sdk';

const ALL_MODULES: MODULE_NAME[] = [
  MODULE_NAME.CSM,
  MODULE_NAME.CSM_02,
  MODULE_NAME.CM,
];

export const resolveDeployedModules = (chainId: number): MODULE_NAME[] =>
  ALL_MODULES.filter(
    (module) => !!MODULE_CONFIG[module][chainId as SUPPORTED_CHAINS],
  );
