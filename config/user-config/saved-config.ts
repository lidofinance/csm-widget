import type { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

// QA overrides persisted in localStorage under `lido-user-config`.
// Shared by the writer (qa-config form via the user-config context) and by
// non-React readers (e.g. surveys-sdk transport) that resolve config at module
// load. Keep the key and shape here so both sides stay in sync.
export const STORAGE_USER_CONFIG = 'lido-user-config';

export type SavedUserConfig = {
  rpcUrls: Partial<Record<SUPPORTED_CHAINS, string>>;
  clApiUrls: Partial<Record<SUPPORTED_CHAINS, string>>;
  ipfsGateways: string[];
  surveyApiUrl?: string;
};

export const DEFAULT_SAVED_USER_CONFIG: SavedUserConfig = {
  rpcUrls: {},
  clApiUrls: {},
  ipfsGateways: [],
};

// SSR-safe synchronous read of the saved QA overrides. Returns defaults during
// SSR or when nothing is stored / parsing fails. Used by modules that resolve
// their config once at load time — these pick up changes only after a reload,
// matching the qa-config form's "Reload the page to apply" behavior.
export const readSavedUserConfig = (): SavedUserConfig => {
  if (typeof window === 'undefined') return DEFAULT_SAVED_USER_CONFIG;
  try {
    const item = window.localStorage.getItem(STORAGE_USER_CONFIG);
    if (!item || item === 'undefined') return DEFAULT_SAVED_USER_CONFIG;
    return { ...DEFAULT_SAVED_USER_CONFIG, ...JSON.parse(item) };
  } catch {
    return DEFAULT_SAVED_USER_CONFIG;
  }
};
