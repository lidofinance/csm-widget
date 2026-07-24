import {
  callSurvey,
  surveyRequest,
  surveysKeys,
  useOperatorKey,
  useSurveyQuery,
} from 'modules/surveys-sdk';
import { delegatesMyGetMyDelegations } from 'modules/surveys-sdk/generated';
import { useDappStatus } from 'modules/web3';
import { useCallback } from 'react';
import { DelegatedOperatorsResponse } from '../types';

export const useDelegatedOperators = (nodeOperatorId?: bigint) => {
  const excludeId = useOperatorKey(nodeOperatorId);
  const { address } = useDappStatus();

  const select = useCallback(
    (data: DelegatedOperatorsResponse) =>
      data.nodeOperatorIds.filter((id) => id !== excludeId),
    [excludeId],
  );

  return useSurveyQuery<DelegatedOperatorsResponse, string[]>(
    surveysKeys.authPath('delegates/my', address),
    ({ token, signal }) =>
      callSurvey(() =>
        delegatesMyGetMyDelegations(surveyRequest(token, signal)),
      ),
    { select },
  );
};
