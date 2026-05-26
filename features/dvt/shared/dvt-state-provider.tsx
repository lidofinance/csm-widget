import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  useIdvtcProof,
  useNodeOperatorId,
  useOperatorOwner,
  useOperatorType,
} from 'modules/web3';
import { endpoints, useSurveysQuery } from 'modules/surveys-sdk';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { DvtResponseDto } from './types';

export type DvtTypeStatus = 'PENDING' | 'ISSUED' | 'OWNER_ISSUED' | 'CLAIMED';

type DvtStateContextType = {
  typeStatus: DvtTypeStatus;
  data?: DvtResponseDto;
  isPending: boolean;
  isTypePending: boolean;
  applyMode: boolean;
  reset: (value?: boolean) => void;
};

const DvtStateContext = createContext<DvtStateContextType>(
  {} as DvtStateContextType,
);

export const useDvtState = () => {
  const context = useContext(DvtStateContext);
  invariant(context, 'Attempt to use `useDvtState` outside of provider');
  return context;
};

export const DvtStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const operatorId = useNodeOperatorId();
  const { data: operatorType } = useOperatorType(operatorId);
  const { data: owner } = useOperatorOwner(operatorId);

  const { data: proofData, isPending: isTypePending } = useIdvtcProof();
  const { data: ownerProofData, isPending: isOwnerTypePending } = useIdvtcProof(
    owner?.address,
  );
  const { data, isPending } = useSurveysQuery<DvtResponseDto>(
    endpoints.dvtStatus,
  );

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const typeStatus: DvtTypeStatus = useMemo(() => {
    if (operatorType === OPERATOR_TYPE.CSM_IDVTC || proofData?.isConsumed)
      return 'CLAIMED';
    if (proofData?.proof) return 'ISSUED';
    if (ownerProofData?.proof) return 'OWNER_ISSUED';
    return 'PENDING';
  }, [
    operatorType,
    ownerProofData?.proof,
    proofData?.isConsumed,
    proofData?.proof,
  ]);

  const value: DvtStateContextType = useMemo(
    () => ({
      typeStatus,
      data,
      isPending,
      isTypePending: isTypePending || (!!owner?.address && isOwnerTypePending),
      applyMode,
      reset: (value = true) => setManualReset(value),
    }),
    [
      typeStatus,
      data,
      isPending,
      isTypePending,
      owner?.address,
      isOwnerTypePending,
      applyMode,
    ],
  );

  return (
    <DvtStateContext.Provider value={value}>
      {children}
    </DvtStateContext.Provider>
  );
};
