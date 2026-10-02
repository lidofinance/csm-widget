import { getDeployedModules, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';

export const deployedModules: MODULE_NAME[] = getDeployedModules(
  config.defaultChain,
);

export const CSM_FAMILY_MODULES: MODULE_NAME[] = [
  MODULE_NAME.CSM,
  MODULE_NAME.CSM_02,
];

export const isCsmFamilyModule = (module: MODULE_NAME): boolean =>
  CSM_FAMILY_MODULES.includes(module);
