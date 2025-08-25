import { useMemo, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@lido-sdk/react';

import { getFeatureFlagsDefault } from './utils';
import { FeatureFlagsType } from './types';

const STORAGE_FEATURE_FLAGS = 'lido-feature-flags';

const FEATURE_FLAGS_DEFAULT = getFeatureFlagsDefault();

export type FeatureFlagsContextType = FeatureFlagsType & {
  setFeatureFlag: (featureFlag: keyof FeatureFlagsType, value: boolean) => void;
};

export const useFeatureFlagsContext = () => {
  const [featureFlagsLocalStorage, setFeatureFlagsLocalStorage] =
    useLocalStorage(STORAGE_FEATURE_FLAGS, FEATURE_FLAGS_DEFAULT);

  const [featureFlagsState, setFeatureFlagsState] = useState<FeatureFlagsType>(
    FEATURE_FLAGS_DEFAULT,
  );

  useEffect(() => {
    setFeatureFlagsState(featureFlagsLocalStorage);
  }, [featureFlagsLocalStorage]);

  const setFeatureFlag = useCallback(
    (featureFlag: keyof FeatureFlagsType, value: boolean) => {
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
