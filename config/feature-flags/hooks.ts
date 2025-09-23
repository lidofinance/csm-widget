import { useContext, useMemo } from 'react';
import invariant from 'tiny-invariant';

import { ConfigContext } from '../provider';
import { FeatureFlagsContextType } from './context-hook';
import { FeatureFlagsType } from './types';

type UseFeatureFlagReturnType<T extends keyof FeatureFlagsType> = {
  [key in T]: boolean;
} & {
  setFeatureFlag: (featureFlag: keyof FeatureFlagsType, value: boolean) => void;
};

export const useFeatureFlag = <T extends keyof FeatureFlagsType>(
  flag: T,
): UseFeatureFlagReturnType<T> | null => {
  const context = useContext(ConfigContext);
  invariant(context, 'Attempt to use `feature flag` outside of provider');
  return useMemo(() => {
    return {
      [flag]: context.featureFlags[flag],
      setFeatureFlag: context.featureFlags?.setFeatureFlag,
    } as UseFeatureFlagReturnType<T>;
  }, [context.featureFlags, flag]);
};

export const useFeatureFlags = (): FeatureFlagsContextType | null => {
  const context = useContext(ConfigContext);
  invariant(context, 'Attempt to use `feature flag` outside of provider');
  return useMemo(() => context.featureFlags, [context.featureFlags]);
};
