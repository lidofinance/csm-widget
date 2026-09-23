import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  OperatorTypeStatus,
  resolveTypeStatus,
  useDappStatus,
  useIcsProof,
  useOperatedNodeOperator,
  useOperatorOwner,
  useOperatorType,
} from 'modules/web3';
import {
  callSurvey,
  surveyRequest,
  useSurveyStatus,
} from 'modules/surveys-sdk';
import { icsGetStatus } from 'modules/surveys-sdk/generated';
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
import { IcsResponseDto } from './types';

export type TypeStatus = OperatorTypeStatus;

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

  const { data: proofData, isPending: isTypePending } = useIcsProof();
  const { data: ownerProofData, isPending: isOwnerTypePending } = useIcsProof(
    owner?.address,
  );
  const { data, isPending } = useSurveyStatus<IcsResponseDto>(
    'ics/status',
    ({ token, signal }) =>
      callSurvey(() => icsGetStatus(surveyRequest(token, signal))),
  );

  const [manualReset, setManualReset] = useState(false);
  const applyMode = useMemo(() => manualReset || !data, [data, manualReset]);

  const typeStatus = resolveTypeStatus({
    operatorType,
    targetType: OPERATOR_TYPE.CSM_ICS,
    isOwner,
    hasOperator,
    proof: proofData,
    ownerProof: ownerProofData,
  });

  const value: IcsStateContextType = useMemo(
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
    <IcsStateContext.Provider value={value}>
      {children}
    </IcsStateContext.Provider>
  );
};
