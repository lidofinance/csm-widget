import { useContext, useMemo } from 'react';
import invariant from 'tiny-invariant';

import { ConfigContext } from '../provider';
import { FeatureFlagsContextType } from './context-hook';

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(ConfigContext);
  invariant(context, 'Attempt to use `feature flag` outside of provider');
  return useMemo(() => context.featureFlags, [context.featureFlags]);
};
