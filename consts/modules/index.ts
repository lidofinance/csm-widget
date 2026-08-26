import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';
import { resolveDeployedModules } from './resolve-deployed-modules';

export { resolveDeployedModules } from './resolve-deployed-modules';

export const deployedModules: MODULE_NAME[] = resolveDeployedModules(
  config.module,
  config.defaultChain,
);

export const isModuleDeployed = (module: MODULE_NAME): boolean =>
  deployedModules.includes(module);
