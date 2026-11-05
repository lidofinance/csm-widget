import type { MODULE_NAME, SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { qaToolsEnabled } from '../qa-tools';
import { STORAGE_USER_CONFIG, readStoredUserConfig } from './storage';

export { STORAGE_USER_CONFIG };

// QA overrides persisted in localStorage under `lido-user-config`.
// Shared by the writer (qa-config form via the user-config context) and by
// non-React readers (e.g. surveys-sdk transport) that resolve config at module
// load. The key lives in `storage.ts`; keep the shape here so both sides stay in sync.
export type SavedUserConfig = {
  rpcUrls: Partial<Record<SUPPORTED_CHAINS, string>>;
  clApiUrls: Partial<Record<SUPPORTED_CHAINS, string>>;
  ipfsGateways: string[];
  surveyApiUrl?: string;
  module?: MODULE_NAME;
};

export const DEFAULT_SAVED_USER_CONFIG: SavedUserConfig = {
  rpcUrls: {},
  clApiUrls: {},
  ipfsGateways: [],
};

// SSR-safe synchronous read of the saved QA overrides. Returns defaults during
// SSR, on prod, or when nothing is stored / parsing fails. Used by modules
// that resolve their config once at load time — these pick up changes only
// after a reload, matching the qa-config form's "Reload the page to apply".
export const readSavedUserConfig = (): SavedUserConfig => {
  if (!qaToolsEnabled || typeof window === 'undefined')
    return DEFAULT_SAVED_USER_CONFIG;
  return { ...DEFAULT_SAVED_USER_CONFIG, ...readStoredUserConfig() };
};
