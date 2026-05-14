import { useMemo, useState, useCallback } from 'react';

import { getUserConfigDefault } from './utils';
import { UserConfigDefaultType } from './types';
import { useLocalStorage } from 'shared/hooks/use-local-storage';
import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

const STORAGE_USER_CONFIG = 'lido-user-config';

type SavedUserConfig = {
  rpcUrls: Partial<Record<SUPPORTED_CHAINS, string>>;
  clApiUrls: Partial<Record<SUPPORTED_CHAINS, string>>;
  ipfsGateways: string[];
};

export type UserConfigContextType = UserConfigDefaultType & {
  savedUserConfig: SavedUserConfig;
  setSavedUserConfig: (config: SavedUserConfig) => void;
  resetSavedUserConfig: () => void;
  isWalletConnectionAllowed: boolean;
  setIsWalletConnectionAllowed: (isAllowed: boolean) => void;
};

const DEFAULT_STATE: SavedUserConfig = {
  rpcUrls: {},
  clApiUrls: {},
  ipfsGateways: [],
};

export const useUserConfigContext = () => {
  const [restoredSettings, setLocalStorage] = useLocalStorage(
    STORAGE_USER_CONFIG,
    DEFAULT_STATE,
  );

  const [isWalletConnectionAllowed, setIsWalletConnectionAllowed] =
    useState(true);

  const [savedUserConfig, setSavedUserConfig] = useState<SavedUserConfig>({
    ...DEFAULT_STATE,
    ...restoredSettings,
  });

  const setSavedConfigAndRemember = useCallback(
    (config: SavedUserConfig) => {
      setLocalStorage(config);
      setSavedUserConfig(config);
    },
    [setLocalStorage],
  );

  const resetSavedUserConfig = useCallback(() => {
    setLocalStorage(DEFAULT_STATE);
    setSavedUserConfig(DEFAULT_STATE);
  }, [setLocalStorage]);

  return useMemo(() => {
    const userConfigDefault = getUserConfigDefault();

    return {
      ...userConfigDefault,
      savedUserConfig,
      setSavedUserConfig: setSavedConfigAndRemember,
      resetSavedUserConfig,
      isWalletConnectionAllowed,
      setIsWalletConnectionAllowed,
    };
  }, [
    isWalletConnectionAllowed,
    savedUserConfig,
    setSavedConfigAndRemember,
    resetSavedUserConfig,
  ]);
};
