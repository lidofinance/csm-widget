import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

export type ClaimTypeSuccessState = {
  justClaimed: boolean;
  markClaimed: () => void;
};

const ClaimTypeSuccessContext = createContext<ClaimTypeSuccessState | null>(
  null,
);
ClaimTypeSuccessContext.displayName = 'ClaimTypeSuccessContext';

export const ClaimTypeSuccessProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [justClaimed, setJustClaimed] = useState(false);
  const markClaimed = useCallback(() => setJustClaimed(true), []);

  const value = useMemo(
    () => ({ justClaimed, markClaimed }),
    [justClaimed, markClaimed],
  );

  return (
    <ClaimTypeSuccessContext.Provider value={value}>
      {children}
    </ClaimTypeSuccessContext.Provider>
  );
};

export const useClaimTypeSuccess = (): ClaimTypeSuccessState => {
  const value = useContext(ClaimTypeSuccessContext);
  invariant(
    value,
    'useClaimTypeSuccess was used outside ClaimTypeSuccessProvider',
  );
  return value;
};
