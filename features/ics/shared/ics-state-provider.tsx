import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import {
  useIcsAddressCheck,
  useIcsOwnerCheck,
} from 'shared/hooks/useIcsAddresses';
import { IcsResponseDto } from './types';
import { useFormStatus } from './use-form-status';

export type TypeStatus = 'PENDING' | 'ISSUED' | 'OWNER_ISSUED' | 'CLAIMED';

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

  const { data: isAddressInIcsList, initialLoading: isAddressPending } =
    useIcsAddressCheck();
  const { data: isOwnerInIcsList, initialLoading: isOwnerPending } =
    useIcsOwnerCheck();

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const typeStatus: TypeStatus = useMemo(() => {
    if (isAddressInIcsList) return 'ISSUED';
    if (isOwnerInIcsList) return 'OWNER_ISSUED';
    return 'PENDING';
  }, [isAddressInIcsList, isOwnerInIcsList]);

  const value: IcsStateContextType = useMemo(
    () => ({
      typeStatus,
      data,
      isPending,
      isTypePending: isAddressPending || isOwnerPending,
      applyMode,
      reset: (value = true) => setManualReset(value),
    }),
    [typeStatus, data, isPending, isAddressPending, isOwnerPending, applyMode],
  );

  return (
    <IcsStateContext.Provider value={value}>
      {children}
    </IcsStateContext.Provider>
  );
};
