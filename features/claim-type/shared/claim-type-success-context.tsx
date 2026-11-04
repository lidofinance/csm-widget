import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useModule, useNodeOperatorId } from 'modules/web3';
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
  const nodeOperatorId = useNodeOperatorId();
  const { module } = useModule();

  useEffect(() => setJustClaimed(false), [nodeOperatorId, module]);

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
