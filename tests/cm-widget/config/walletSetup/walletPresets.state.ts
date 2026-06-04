import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { type PresetName } from './walletPresets';

export const STATE_FILE = path.join(process.cwd(), '.walletPresets.state.json');

export type PresetRuntime = {
  secretPhrase: string;
  noId?: number;
};

export type PresetsState = Record<PresetName, PresetRuntime>;

export const writePresetsState = (state: PresetsState): void => {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
};

const loadPresetsState = (): PresetsState => {
  if (!existsSync(STATE_FILE)) {
    return {} as PresetsState;
  }
  return JSON.parse(readFileSync(STATE_FILE, 'utf-8')) as PresetsState;
};

export const PRESETS = loadPresetsState();
