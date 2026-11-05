import { config } from 'config';
import { MODULE_METADATA, hasModuleOverride } from 'consts/module';
import { useIsHydrated } from './use-is-hydrated';

const useHydratedModule = () =>
  useIsHydrated() ? config.module : config.envModule;

export const useRenderedModule = hasModuleOverride
  ? useHydratedModule
  : () => config.module;

export const useModuleMeta = () => MODULE_METADATA[useRenderedModule()];
