import { useDappStatus } from 'modules/web3';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { CreateSuccess, resolveCreated } from './create-success';

export type CreateSuccessState = {
  created?: CreateSuccess;
  setCreated: (created: CreateSuccess) => void;
};

const CreateSuccessContext = createContext<CreateSuccessState | null>(null);
CreateSuccessContext.displayName = 'CreateSuccessContext';

export const CreateSuccessProvider: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useDappStatus();
  const [stored, setCreated] = useState<CreateSuccess>();
  const created = resolveCreated(stored, address);

  const value = useMemo(() => ({ created, setCreated }), [created]);

  return (
    <CreateSuccessContext.Provider value={value}>
      {children}
    </CreateSuccessContext.Provider>
  );
};

export const useCreateSuccess = (): CreateSuccessState => {
  const value = useContext(CreateSuccessContext);
  invariant(value, 'useCreateSuccess was used outside CreateSuccessProvider');
  return value;
};
