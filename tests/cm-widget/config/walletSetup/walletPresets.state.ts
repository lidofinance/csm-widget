import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { type PresetName } from './walletPresets';

export const STATE_FILE = path.join(process.cwd(), '.walletPresets.state.json');

export type PresetRuntime = {
  secretPhrase: string;
  address: `0x${string}`;
  noId?: number;
  state: string[];
  gates?: string[];
};

export type PresetsState = Record<PresetName, PresetRuntime>;

export const writePresetsState = (state: PresetsState): void => {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
};

const readStateFile = (): PresetsState => {
  if (!existsSync(STATE_FILE)) {
    throw new Error(
      `[PRESETS] State file not found: ${STATE_FILE}\nRun tests with USE_FORK=true so globalSetup can generate preset accounts.`,
    );
  }
  return JSON.parse(readFileSync(STATE_FILE, 'utf-8')) as PresetsState;
};

let _cache: PresetsState | undefined;

// Lazy: reads the file only on first property access, not at import time.
export const PRESETS = new Proxy({} as PresetsState, {
  get: (_target, key) => {
    if (!_cache) _cache = readStateFile();
    return _cache[key as PresetName];
  },
});
