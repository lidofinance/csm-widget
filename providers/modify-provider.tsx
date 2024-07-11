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
  const [customAddresses, setCustomAddresses] = useSessionStorage(
    'custom-address',
    false,
  );
  const { query, isReady } = useRouter();

  useEffect(() => {
    if (isReady && query.addrs !== undefined) {
      setCustomAddresses(true);
    }
  }, [isReady, query.addrs, setCustomAddresses]);

  const value: ModifyContextValue = useMemo(
    () => ({
      customAddresses,
    }),
    [customAddresses],
  );
  return (
    <ModifyContext.Provider value={value}>{children}</ModifyContext.Provider>
  );
};
