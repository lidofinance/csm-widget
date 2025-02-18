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
import { useSessionStorage } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { trackMatomoEvent } from 'utils';
import { Address } from 'wagmi';

type ModifyContextValue = {
  referrer?: Address;
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

  useEffect(() => {
    const ref = REF_MAPPING.find(({ ref }) => ref === 'dappnode')?.address; // DAPPNODE

    if (ref && ref !== referrer && isAddress(ref)) {
      setReferrer(ref);
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.visitWithReferrer);
    }
  }, [referrer, setReferrer]);

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
