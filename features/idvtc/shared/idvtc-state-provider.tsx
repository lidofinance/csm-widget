import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  OperatorTypeStatus,
  resolveTypeStatus,
  useDappStatus,
  useIdvtcProof,
  useOperatedNodeOperator,
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
import { isAddressEqual } from 'viem';
import { IdvtcResponseDto } from './types';

export type IdvtcTypeStatus = OperatorTypeStatus;

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
  // A claimer-only wallet applies for itself, not for the operator it claims for.
  const nodeOperator = useOperatedNodeOperator();
  const operatorId = nodeOperator?.nodeOperatorId;
  // The type only exists in CSM: an operator of another module never holds it.
  const hasOperator = nodeOperator?.module === MODULE_NAME.CSM;
  const { data: operatorType } = useOperatorType(
    hasOperator ? nodeOperator : undefined,
  );
  const { data: owner } = useOperatorOwner({ nodeOperatorId: operatorId });
  const { address } = useDappStatus();
  const isOwner =
    !!owner?.address && !!address && isAddressEqual(owner.address, address);

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

  const typeStatus = resolveTypeStatus({
    operatorType,
    targetType: OPERATOR_TYPE.CSM_IDVTC,
    isOwner,
    hasOperator,
    proof: proofData,
    ownerProof: ownerProofData,
  });

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
