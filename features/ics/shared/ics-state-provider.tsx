import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  callSurvey,
  surveyRequest,
  useSurveyStatus,
} from 'modules/surveys-sdk';
import { icsGetStatus } from 'modules/surveys-sdk/generated';
import { createContext, FC, PropsWithChildren, useContext } from 'react';
import {
  TypeApplyState,
  useTypeApplyState,
} from 'shared/node-operator/type-status';
import invariant from 'tiny-invariant';
import { IcsResponseDto } from './types';

type IcsStateContextType = TypeApplyState<IcsResponseDto>;

const IcsStateContext = createContext<IcsStateContextType>(
  {} as IcsStateContextType,
);

export const useIcsState = () => {
  const context = useContext(IcsStateContext);
  invariant(context, 'Attempt to use `useIcsState` outside of provider');
  return context;
};

export const IcsStateProvider: FC<PropsWithChildren> = ({ children }) => {
  const surveyQuery = useSurveyStatus<IcsResponseDto>(
    'ics/status',
    ({ token, signal }) =>
      callSurvey(() => icsGetStatus(surveyRequest(token, signal))),
  );
  const value = useTypeApplyState(OPERATOR_TYPE.CSM_ICS, surveyQuery);

  return (
    <IcsStateContext.Provider value={value}>
      {children}
    </IcsStateContext.Provider>
  );
};
