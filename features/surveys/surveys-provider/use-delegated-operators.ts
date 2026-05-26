import {
  endpoints,
  useOperatorKey,
  useSurveysQuery,
} from 'modules/surveys-sdk';
import { useCallback } from 'react';
import { DelegatedOperatorsResponse } from '../types';

export const useDelegatedOperators = (nodeOperatorId?: bigint) => {
  const excludeId = useOperatorKey(nodeOperatorId);

  const select = useCallback(
    (data: DelegatedOperatorsResponse) =>
      data.nodeOperatorIds.filter((id) => id !== excludeId),
    [excludeId],
  );

  return useSurveysQuery<DelegatedOperatorsResponse, string[]>(
    endpoints.myDelegates,
    { select },
  );
};
