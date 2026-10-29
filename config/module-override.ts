import { MODULE_NAME, SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { resolveModuleOverride } from './resolve-module-override';
import {
  readStoredUserConfig,
  writeStoredUserConfig,
} from './user-config/storage';

let resolved: MODULE_NAME | undefined;

const stripModuleParam = () => {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('module');
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
  } catch {
    // history API unavailable; the param is re-applied on reload
  }
};

const compute = (
  envModule: MODULE_NAME,
  chainId: SUPPORTED_CHAINS,
): MODULE_NAME => {
  const param = new URLSearchParams(window.location.search).get('module');

  if (param !== null) {
    const normalized = param.trim().toLowerCase();
    const cleared = normalized === '' || normalized === 'default';
    const seeded = cleared ? undefined : resolveModuleOverride(param, chainId);

    if (cleared) writeStoredUserConfig({ module: undefined });
    else if (seeded) writeStoredUserConfig({ module: seeded });
    stripModuleParam();

    if (cleared) return envModule;
    if (seeded) return seeded;
  }

  return (
    resolveModuleOverride(readStoredUserConfig().module, chainId) ?? envModule
  );
};

// QA-only: `?module=` seeds the stored override, `''`/'default' clears it
export const resolveClientModule = (
  envModule: MODULE_NAME,
  chainId: SUPPORTED_CHAINS,
): MODULE_NAME => {
  if (typeof window === 'undefined') return envModule;
  resolved ??= compute(envModule, chainId);
  return resolved;
};
