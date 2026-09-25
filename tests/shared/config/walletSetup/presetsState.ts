import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import type { ModuleName } from 'tests/shared/contracts/constants';
export { type PresetRuntime } from './types';
import { type PresetRuntime } from './types';

export const STATE_FILE = path.join(process.cwd(), '.walletPresets.state.json');

export type ModulePresets = Record<string, PresetRuntime>;

type PresetsFile = Partial<Record<ModuleName, ModulePresets>>;

const MODULES = Object.values(MODULE_NAME) as ModuleName[];

const readFile = (): PresetsFile => {
  if (!existsSync(STATE_FILE)) return {};
  const raw = JSON.parse(readFileSync(STATE_FILE, 'utf-8')) as PresetsFile;
  return Object.fromEntries(
    MODULES.filter((module) => raw[module]).map((module) => [
      module,
      raw[module],
    ]),
  );
};

export const hasModulePresets = (module: ModuleName): boolean =>
  readFile()[module] !== undefined;

export const writeModulePresets = (
  module: ModuleName,
  presets: ModulePresets,
): void => {
  writeFileSync(
    STATE_FILE,
    JSON.stringify({ ...readFile(), [module]: presets }, null, 2),
  );
};

export const readPreset = (module: ModuleName, name: string): PresetRuntime => {
  const runtime = readFile()[module]?.[name];
  if (!runtime) {
    throw new Error(
      `[PRESETS] No "${name}" preset for ${module} in ${STATE_FILE}.\n` +
        'Run the suite with USE_FORK=true so globalSetup can generate preset accounts.',
    );
  }
  return runtime;
};
