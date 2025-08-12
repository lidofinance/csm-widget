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
import { useDappStatus, useIcsProof } from 'modules/web3';

export type TypeStatus = 'PENDING' | 'ISSUED' | 'CLAIMED';

type IcsStateContextType = {
  typeStatus: TypeStatus;
  data?: IcsResponseDto;
  isPending: boolean;
  isTypePending: boolean;
  applyMode: boolean;
  reset: () => void;
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
  const { address } = useDappStatus();

  const { data: proofData, isPending: isTypePending } = useIcsProof(address);
  const { data, isPending } = useFormStatus();

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const value: IcsStateContextType = useMemo(
    () => ({
      typeStatus: proofData?.isConsumed
        ? 'CLAIMED'
        : proofData?.proof
          ? 'ISSUED'
          : 'PENDING',
      data,
      isPending,
      isTypePending,
      applyMode,
      reset: () => setManualReset(true),
    }),
    [applyMode, data, isPending, isTypePending, proofData],
  );

  return (
    <IcsStateContext.Provider value={value}>
      {children}
    </IcsStateContext.Provider>
  );
};
