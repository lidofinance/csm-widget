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

type ModifyContextValue = {
  customAddresses: boolean;
  referrer?: string;
};

const CUSTOM_ADDRESSES_QUERY = 'addrs';
const REFERRER_QUERY = 'ref';

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

  // TODO: may be store Referrer in LocalStorage ?
  const [referrer, setReferrer] = useSessionStorage<string | undefined>(
    'referrer',
    undefined,
  );
  const { query, isReady } = useRouter();

  useEffect(() => {
    if (isReady && query[CUSTOM_ADDRESSES_QUERY] !== undefined) {
      setCustomAddresses(true);
    }
    if (isReady && query['mode'] === 'extended') {
      setCustomAddresses(true);
    }
    if (isReady && query[REFERRER_QUERY]) {
      // TODO: validate referrer
      // TODO: do not rewrite referrer ?
      setReferrer(query[REFERRER_QUERY] as string);
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
