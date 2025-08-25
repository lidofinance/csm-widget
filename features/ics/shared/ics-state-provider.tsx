import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { IcsResponseDto } from './types';
import { useFormStatus } from './use-form-status';

export type TypeStatus = 'PENDING' | 'ISSUED' | 'CLAIMED';

type IcsStateContextType = {
  typeStatus: TypeStatus;
  data?: IcsResponseDto;
  isPending: boolean;
  isTypePending: boolean;
  applyMode: boolean;
  reset: (value?: boolean) => void;
};

const IcsStateContext = createContext<IcsStateContextType>(
  {} as IcsStateContextType,
);

export const useIcsState = () => {
  const context = useContext(IcsStateContext);
  invariant(context, 'Attempt to use `useIcsState` outside of provider');
  return context;
};

export const IcsStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useFormStatus();
  const isPending = data === undefined;

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const value: IcsStateContextType = useMemo(
    () => ({
      typeStatus: 'PENDING',
      data,
      isPending,
      isTypePending: false,
      applyMode,
      reset: (value = true) => setManualReset(value),
    }),
    [applyMode, data, isPending],
  );

  return (
    <IcsStateContext.Provider value={value}>
      {children}
    </IcsStateContext.Provider>
  );
};
