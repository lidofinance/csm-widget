import { useMemo, useState, useCallback } from 'react';

import { getUserConfigDefault } from './utils';
import { UserConfigDefaultType } from './types';
import { useLocalStorage } from 'shared/hooks/use-local-storage';
import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

const STORAGE_USER_CONFIG = 'lido-user-config';

type SavedUserConfig = {
  rpcUrls: Partial<Record<CSM_SUPPORTED_CHAINS, string>>;
  clApiUrls: Partial<Record<CSM_SUPPORTED_CHAINS, string>>;
};

export type UserConfigContextType = UserConfigDefaultType & {
  savedUserConfig: SavedUserConfig;
  setSavedUserConfig: (config: SavedUserConfig) => void;
  isWalletConnectionAllowed: boolean;
  setIsWalletConnectionAllowed: (isAllowed: boolean) => void;
};

const DEFAULT_STATE: SavedUserConfig = {
  rpcUrls: {},
  clApiUrls: {},
};

export const useUserConfigContext = () => {
  const [restoredSettings, setLocalStorage] = useLocalStorage(
    STORAGE_USER_CONFIG,
    DEFAULT_STATE,
  );

  const [isWalletConnectionAllowed, setIsWalletConnectionAllowed] =
    useState(true);

  const [savedUserConfig, setSavedUserConfig] =
    useState<SavedUserConfig>(restoredSettings);

  const setSavedConfigAndRemember = useCallback(
    (config: SavedUserConfig) => {
      setLocalStorage(config);
      setSavedUserConfig(config);
    },
    [setLocalStorage],
  );

  return useMemo(() => {
    const userConfigDefault = getUserConfigDefault();

    return {
      ...userConfigDefault,
      savedUserConfig,
      setSavedUserConfig: setSavedConfigAndRemember,
      isWalletConnectionAllowed,
      setIsWalletConnectionAllowed,
    };
  }, [isWalletConnectionAllowed, savedUserConfig, setSavedConfigAndRemember]);
};
