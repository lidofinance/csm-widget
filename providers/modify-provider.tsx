import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { REF_MAPPING } from 'consts/ref-mapping';
import { isAddress } from 'ethers/lib/utils.js';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useSearchParams, useSessionStorage } from 'shared/hooks';
import { useFeatureFlags } from 'config/feature-flags';
import { ICS_ENABLED } from 'config/feature-flags/types';
import invariant from 'tiny-invariant';
import { compareLowercase, trackMatomoEvent } from 'utils';
import { Address } from 'wagmi';

type ModifyContextValue = {
  referrer?: Address;
};

const QUERY_REFERRER = 'ref';
const QUERY_ICS_APPLY = 'ics-apply';

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

    const icsApplyParam = query?.get(QUERY_ICS_APPLY);

    if (icsApplyParam && !featureFlags.icsEnabled) {
      featureFlags.setFeatureFlag(ICS_ENABLED, true);
    }
  }, [featureFlags, query]);

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
