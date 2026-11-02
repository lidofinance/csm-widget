import { resolveCreated } from 'features/create-node-operator/create-success/create-success';
import { useDappStatus } from 'modules/web3';
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
import { CuratedOperatorCreated } from './curated-operator-created';

export type CuratedOperatorCreatedValue = {
  created?: CuratedOperatorCreated;
  setCreated: (created: CuratedOperatorCreated) => void;
  clearCreated: () => void;
};

const CuratedOperatorCreatedContext =
  createContext<CuratedOperatorCreatedValue | null>(null);

export const CuratedOperatorCreatedProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { address } = useDappStatus();
  const [created, setCreated] = useState<CuratedOperatorCreated>();
  const clearCreated = useCallback(() => setCreated(undefined), []);

  const value = useMemo(
    () => ({
      created: resolveCreated(created, address),
      setCreated,
      clearCreated,
    }),
    [created, address, clearCreated],
  );

  return (
    <CuratedOperatorCreatedContext.Provider value={value}>
      {children}
    </CuratedOperatorCreatedContext.Provider>
  );
};

export const useCuratedOperatorCreated = () => {
  const value = useContext(CuratedOperatorCreatedContext);
  invariant(
    value,
    'useCuratedOperatorCreated was used outside CuratedOperatorCreatedProvider',
  );
  return value;
};
