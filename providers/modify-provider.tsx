import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { REF_MAPPING } from 'consts/ref-mapping';
import { isAddress } from 'ethers/lib/utils.js';
import { useRouter } from 'next/router';
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
};

const QUERY_REFERRER = 'ref';

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

  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!query || !router.isReady) return;

    const refParam = query?.get(QUERY_REFERRER) ?? undefined;

    // eslint-disable-next-line no-console
    console.log('ref', router.query.ref);

    const ref =
      REF_MAPPING.find(({ ref }) => compareLowercase(ref, refParam))?.address ||
      refParam;

    if (ref && ref !== referrer && isAddress(ref)) {
      setReferrer(ref);

      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.visitWithReferrer);
    }
  }, [query, referrer, router, setReferrer]);

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
