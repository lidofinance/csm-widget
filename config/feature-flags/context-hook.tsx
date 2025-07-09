import { useCallback, useMemo, useState } from 'react';

import { useLocalStorage } from 'shared/hooks/use-local-storage';
import { FeatureFlagsType } from './types';
import { getFeatureFlagsDefault } from './utils';

const STORAGE_FEATURE_FLAGS = 'lido-feature-flags';

const FEATURE_FLAGS_DEFAULT = getFeatureFlagsDefault();

export type FeatureFlagsContextType = FeatureFlagsType & {
  setFeatureFlag: (featureFlag: keyof FeatureFlagsType, value: boolean) => void;
};

export const useFeatureFlagsContext = () => {
  const [featureFlagsLocalStorage, setFeatureFlagsLocalStorage] =
    useLocalStorage(STORAGE_FEATURE_FLAGS, FEATURE_FLAGS_DEFAULT);

  const [featureFlagsState, setFeatureFlagsState] = useState<FeatureFlagsType>(
    featureFlagsLocalStorage,
  );

  const setFeatureFlag = useCallback(
    (featureFlag: keyof FeatureFlagsType, value: boolean) => {
      setFeatureFlagsLocalStorage({
        ...featureFlagsState,
        [featureFlag]: value,
      });
      setFeatureFlagsState({
        ...featureFlagsState,
        [featureFlag]: value,
      });
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
