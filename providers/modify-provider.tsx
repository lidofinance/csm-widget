import { useLocalStorage } from '@lido-sdk/react';
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
import { getFirstParam } from 'utils';
import { Address } from 'wagmi';

type ModifyContextValue = {
  customAddresses: boolean;
  referrer?: Address;
};

const QUERY_REFERRER = 'ref';
const QUERY_MODE = 'ref';
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

  const [referrer, setReferrer] = useLocalStorage<Address | undefined>(
    'referrer',
    undefined,
  );

  const { query, isReady } = useRouter();

  useEffect(() => {
    if (!isReady) return;

    const mode = getFirstParam(query[QUERY_MODE]);
    const ref = getFirstParam(query[QUERY_REFERRER]);

    if (mode === MODE_EXTENDED) {
      setCustomAddresses(true);
    }

    if (ref && isAddress(ref)) {
      setReferrer(ref);
    }
  }, [isReady, query, setCustomAddresses, setReferrer]);

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
