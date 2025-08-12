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
import {
  useDappStatus,
  useIcsProof,
  useNodeOperatorId,
  useOperatorType,
} from 'modules/web3';
import { OPERATOR_TYPE } from 'consts';

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
  const { address } = useDappStatus();
  const operatorId = useNodeOperatorId();
  const { data: operatorType } = useOperatorType(operatorId);

  const { data: proofData, isPending: isTypePending } = useIcsProof(address);
  const { data, isPending } = useFormStatus();

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const value: IcsStateContextType = useMemo(
    () => ({
      typeStatus:
        operatorType === OPERATOR_TYPE.ICS || proofData?.isConsumed
          ? 'CLAIMED'
          : proofData?.proof
            ? 'ISSUED'
            : 'PENDING',
      data,
      isPending,
      isTypePending,
      applyMode,
      reset: (value = true) => setManualReset(value),
    }),
    [applyMode, data, isPending, isTypePending, proofData, operatorType],
  );

  return (
    <IcsStateContext.Provider value={value}>
      {children}
    </IcsStateContext.Provider>
  );
};
