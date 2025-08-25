import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { useIcsAddressCheck } from 'shared/hooks/useIcsAddresses';
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

  const { data: isAddressInIcsList, initialLoading: isTypePending } =
    useIcsAddressCheck();

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const typeStatus: TypeStatus = useMemo(() => {
    if (isAddressInIcsList) return 'ISSUED';
    return 'PENDING';
  }, [isAddressInIcsList]);

  const value: IcsStateContextType = useMemo(
    () => ({
      typeStatus,
      data,
      isPending,
      isTypePending,
      applyMode,
      reset: (value = true) => setManualReset(value),
    }),
    [typeStatus, data, isPending, isTypePending, applyMode],
  );

  return (
    <IcsStateContext.Provider value={value}>
      {children}
    </IcsStateContext.Provider>
  );
};
