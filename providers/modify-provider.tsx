import { useLocalStorage } from '@lido-sdk/react';
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
import invariant from 'tiny-invariant';
import { compareLowercase, trackMatomoEvent } from 'utils';
import { Address } from 'wagmi';

type ModifyContextValue = {
  referrer?: Address;
  icsEnabled?: boolean;
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

  const [icsEnabled, setIcsEnabled] = useLocalStorage<boolean>(
    'ics-enabled',
    false,
  );

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
    if (!query) return;

    const icsApplyParam = query?.get(QUERY_ICS_APPLY);

    if (icsApplyParam && !icsEnabled) {
      setIcsEnabled(true);
    }
  }, [icsEnabled, query, setIcsEnabled]);

  const value: ModifyContextValue = useMemo(
    () => ({
      referrer,
      icsEnabled,
    }),
    [icsEnabled, referrer],
  );
  return (
    <ModifyContext.Provider value={value}>{children}</ModifyContext.Provider>
  );
};
