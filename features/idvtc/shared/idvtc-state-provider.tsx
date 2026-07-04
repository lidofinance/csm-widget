import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  useIdvtcProof,
  useNodeOperatorId,
  useOperatorOwner,
  useOperatorType,
} from 'modules/web3';
import {
  callSurvey,
  surveyRequest,
  useSurveyStatus,
} from 'modules/surveys-sdk';
import { idvtcGetStatus } from 'modules/surveys-sdk/generated';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';
import { IdvtcResponseDto } from './types';

export type IdvtcTypeStatus = 'PENDING' | 'ISSUED' | 'OWNER_ISSUED' | 'CLAIMED';

type IdvtcStateContextType = {
  typeStatus: IdvtcTypeStatus;
  data?: IdvtcResponseDto;
  isPending: boolean;
  isTypePending: boolean;
  applyMode: boolean;
  reset: (value?: boolean) => void;
};

const IdvtcStateContext = createContext<IdvtcStateContextType>(
  {} as IdvtcStateContextType,
);

export const useIdvtcState = () => {
  const context = useContext(IdvtcStateContext);
  invariant(context, 'Attempt to use `useIdvtcState` outside of provider');
  return context;
};

export const IdvtcStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const operatorId = useNodeOperatorId();
  const { data: operatorType } = useOperatorType(operatorId);
  const { data: owner } = useOperatorOwner(operatorId);

  const { data: proofData, isPending: isTypePending } = useIdvtcProof();
  const { data: ownerProofData, isPending: isOwnerTypePending } = useIdvtcProof(
    owner?.address,
  );
  const { data, isPending } = useSurveyStatus<IdvtcResponseDto>(
    'idvtc/status',
    ({ token, signal }) =>
      callSurvey(() => idvtcGetStatus(surveyRequest(token, signal))),
  );

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const typeStatus: IdvtcTypeStatus = useMemo(() => {
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

  const value: IdvtcStateContextType = useMemo(
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
    <IdvtcStateContext.Provider value={value}>
      {children}
    </IdvtcStateContext.Provider>
  );
};
