import { useCallback, useEffect, useMemo, useState } from 'react';

import { useLocalStorage } from 'shared/hooks/use-local-storage';
import { FeatureFlagsType } from './types';
import { qaToolsEnabled } from '../qa-tools';
import { getFeatureFlagsDefault } from './utils';

const STORAGE_FEATURE_FLAGS = 'lido-feature-flags';

const FEATURE_FLAGS_DEFAULT = getFeatureFlagsDefault();

export type FeatureFlagsContextType = FeatureFlagsType & {
  setFeatureFlag: (featureFlag: keyof FeatureFlagsType, value: boolean) => void;
};

export const useFeatureFlagsContext = () => {
  const [featureFlagsLocalStorage, setFeatureFlagsLocalStorage] =
    useLocalStorage(
      qaToolsEnabled ? STORAGE_FEATURE_FLAGS : undefined,
      FEATURE_FLAGS_DEFAULT,
    );

  const [featureFlagsState, setFeatureFlagsState] = useState<FeatureFlagsType>(
    FEATURE_FLAGS_DEFAULT,
  );

  useEffect(() => {
    setFeatureFlagsState(featureFlagsLocalStorage);
  }, [featureFlagsLocalStorage]);

  const setFeatureFlag = useCallback(
    (featureFlag: keyof FeatureFlagsType, value: boolean) => {
      if (!qaToolsEnabled) return;
      const newFlags = {
        ...featureFlagsState,
        [featureFlag]: value,
      };
      setFeatureFlagsLocalStorage(newFlags);
      setFeatureFlagsState(newFlags);
    },
    [featureFlagsState, setFeatureFlagsLocalStorage],
  );

  return useMemo(() => {
    return {
      ...FEATURE_FLAGS_DEFAULT,
      ...featureFlagsState,
      setFeatureFlag: setFeatureFlag,
    };
  }, [featureFlagsState, setFeatureFlag]);
};
