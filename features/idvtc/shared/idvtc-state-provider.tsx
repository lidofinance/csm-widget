import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  callSurvey,
  surveyRequest,
  useSurveyStatus,
} from 'modules/surveys-sdk';
import { idvtcGetStatus } from 'modules/surveys-sdk/generated';
import { createContext, FC, PropsWithChildren, useContext } from 'react';
import {
  TypeApplyState,
  useTypeApplyState,
} from 'shared/node-operator/type-status';
import invariant from 'tiny-invariant';
import { IdvtcResponseDto } from './types';

type IdvtcStateContextType = TypeApplyState<IdvtcResponseDto>;

const IdvtcStateContext = createContext<IdvtcStateContextType>(
  {} as IdvtcStateContextType,
);

export const useIdvtcState = () => {
  const context = useContext(IdvtcStateContext);
  invariant(context, 'Attempt to use `useIdvtcState` outside of provider');
  return context;
};

export const IdvtcStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const surveyQuery = useSurveyStatus<IdvtcResponseDto>(
    'idvtc/status',
    ({ token, signal }) =>
      callSurvey(() => idvtcGetStatus(surveyRequest(token, signal))),
  );
  const value = useTypeApplyState(OPERATOR_TYPE.CSM_IDVTC, surveyQuery);

  return (
    <IdvtcStateContext.Provider value={value}>
      {children}
    </IdvtcStateContext.Provider>
  );
};
