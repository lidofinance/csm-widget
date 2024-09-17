import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
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
import { useSessionStorage } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { getFirstParam, trackMatomoEvent } from 'utils';
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

  const { query, isReady } = useRouter();

  useEffect(() => {
    if (!isReady || customAddresses) return;

    const mode = getFirstParam(query[QUERY_MODE]);

    if (mode === MODE_EXTENDED) {
      setCustomAddresses(true);

      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.visitWithModeExtended);
    }
  }, [customAddresses, isReady, query, setCustomAddresses]);

  useEffect(() => {
    if (!isReady) return;

    const ref = getFirstParam(query[QUERY_REFERRER]);

    if (ref && ref !== referrer && isAddress(ref)) {
      setReferrer(ref);

      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.visitWithReferrer);
    }
  }, [isReady, query, referrer, setReferrer]);

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
