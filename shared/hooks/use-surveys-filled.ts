import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import {
  endpoints,
  useOperatorKey,
  usePublicSurvey,
} from 'modules/surveys-sdk';

export const useSurveysFilled = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const operatorKey = useOperatorKey(nodeOperatorId);
  const path = operatorKey ? endpoints.publicSummary(operatorKey) : null;

  return usePublicSurvey<{ isFilled: boolean }>(path);
};
