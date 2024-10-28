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
  customAddresses: boolean;
  referrer?: Address;
};

const QUERY_REFERRER = 'ref';
const QUERY_MODE = 'mode';
const MODE_EXTENDED = 'extended';

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
  const [customAddresses, setCustomAddresses] = useSessionStorage(
    'custom-address',
    false,
  );

  const [referrer, setReferrer] = useSessionStorage<Address | undefined>(
    'referrer',
    undefined,
  );

  const query = useSearchParams();

  useEffect(() => {
    if (!query || customAddresses) return;

    const mode = query.get(QUERY_MODE) ?? undefined;

    if (mode === MODE_EXTENDED) {
      setCustomAddresses(true);

      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.visitWithModeExtended);
    }
  }, [customAddresses, query, setCustomAddresses]);

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

  const value: ModifyContextValue = useMemo(
    () => ({
      customAddresses,
      referrer,
    }),
    [customAddresses, referrer],
  );
  return (
    <ModifyContext.Provider value={value}>{children}</ModifyContext.Provider>
  );
};
