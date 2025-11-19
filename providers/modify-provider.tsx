import { useFeatureFlags } from 'config/feature-flags';
import {
  FeatureFlagsType,
  ICS_APPLY_FORM,
  SURVEYS_SETUP_ENABLED,
  USE_WALLET_RPC,
} from 'config/feature-flags/types';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { REF_MAPPING } from 'consts/ref-mapping';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useSearchParams, useSessionStorage } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { compareLowercase, isTruthy, trackMatomoEvent } from 'utils';
import { Address, isAddress } from 'viem';

type ModifyContextValue = {
  referrer?: Address;
};

const QUERY_REFERRER = 'ref';

const FEATURE_FLAG_QUERY_MAPPING: Record<string, keyof FeatureFlagsType> = {
  'wallet-rpc': USE_WALLET_RPC,
  'ics-apply': ICS_APPLY_FORM,
  'survey-setup': SURVEYS_SETUP_ENABLED,
};

const ModifyContext = createContext<ModifyContextValue | null>(null);
ModifyContext.displayName = 'ModifyContext';

export const useModifyContext = () => {
  const value = useContext(ModifyContext);
  invariant(
    value !== null,
    'useModifyContext was used used outside of ModifyContext',
  );
  return value;
};

export const ModifyProvider: FC<PropsWithChildren> = ({ children }) => {
  const [referrer, setReferrer] = useSessionStorage<Address | undefined>(
    'referrer',
    undefined,
  );
  const featureFlags = useFeatureFlags();

  const query = useSearchParams();

  useEffect(() => {
    if (!query) return;

    const refParam = query?.get(QUERY_REFERRER) ?? undefined;

    const ref =
      REF_MAPPING.find(({ ref }) => compareLowercase(ref, refParam))?.address ||
      refParam;

    if (ref && ref !== referrer && isAddress(ref)) {
      setReferrer(ref);

      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.visitWithReferrer);
    }
  }, [query, referrer, setReferrer]);

  useEffect(() => {
    if (!query || !featureFlags) return;

    Object.entries(FEATURE_FLAG_QUERY_MAPPING).forEach(
      ([queryParam, flagName]) => {
        const queryValue = query.get(queryParam);

        if (queryValue !== null) {
          const shouldEnable = isTruthy(queryValue);
          const currentValue = featureFlags[flagName];

          // Only update if the value differs from current state
          if (shouldEnable !== currentValue) {
            // eslint-disable-next-line no-console
            console.log(
              `[Feature Flag] ${shouldEnable ? 'Enabling' : 'Disabling'} "${flagName}" via query parameter "${queryParam}=${queryValue}"`,
            );
            featureFlags.setFeatureFlag(flagName, shouldEnable);
          }
        }
      },
    );
  }, [query, featureFlags]);

  const value: ModifyContextValue = useMemo(
    () => ({
      referrer,
    }),
    [referrer],
  );
  return (
    <ModifyContext.Provider value={value}>{children}</ModifyContext.Provider>
  );
};
