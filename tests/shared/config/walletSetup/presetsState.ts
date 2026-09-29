import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import type { ChainName, ModuleName } from 'tests/shared/contracts/constants';
export { type PresetRuntime } from './types';
import { type PresetRuntime } from './types';

export const stateFile = (chain: ChainName): string =>
  path.join(process.cwd(), `.${chain}.walletPresets.state.json`);

export type ModulePresets = Record<string, PresetRuntime>;

type PresetsFile = Partial<Record<ModuleName, ModulePresets>>;

const MODULES = Object.values(MODULE_NAME) as ModuleName[];

const readFile = (chain: ChainName): PresetsFile => {
  const file = stateFile(chain);
  if (!existsSync(file)) return {};
  const raw = JSON.parse(readFileSync(file, 'utf-8')) as PresetsFile;
  return Object.fromEntries(
    MODULES.filter((module) => raw[module]).map((module) => [
      module,
      raw[module],
    ]),
  );
};

export const hasModulePresets = (
  chain: ChainName,
  module: ModuleName,
): boolean => readFile(chain)[module] !== undefined;

export const writeModulePresets = (
  chain: ChainName,
  module: ModuleName,
  presets: ModulePresets,
): void => {
  writeFileSync(
    stateFile(chain),
    JSON.stringify({ ...readFile(chain), [module]: presets }, null, 2),
  );
};

export const readPreset = (
  chain: ChainName,
  module: ModuleName,
  name: string,
): PresetRuntime => {
  const runtime = readFile(chain)[module]?.[name];
  if (!runtime) {
    throw new Error(
      `[PRESETS] No "${name}" preset for ${module} in ${stateFile(chain)}.\n` +
        'globalSetup generates them — delete the state file to rebuild it.',
    );
  }
  return runtime;
};
