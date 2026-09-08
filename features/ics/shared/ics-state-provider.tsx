import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  useIcsProof,
  useNodeOperator,
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
import { IcsResponseDto } from './types';

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
  const { nodeOperator } = useNodeOperator();
  const operatorId = nodeOperator?.nodeOperatorId;
  // The type only exists in CSM: an operator of another module never holds it.
  const { data: operatorType } = useOperatorType(
    nodeOperator?.module === MODULE_NAME.CSM ? nodeOperator : undefined,
  );
  const { data: owner } = useOperatorOwner(operatorId);

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

  const typeStatus: TypeStatus = useMemo(() => {
    if (operatorType === OPERATOR_TYPE.CSM_ICS || proofData?.isConsumed)
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
