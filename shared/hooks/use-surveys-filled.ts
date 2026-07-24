import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  usePublicSurvey,
} from 'modules/surveys-sdk';
import { openIndex } from 'modules/surveys-sdk/generated';
import type { FilledDto } from 'modules/surveys-sdk/generated';

export const useSurveysFilled = (
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const operatorKey = useOperatorKey(nodeOperatorId);
  // Public cache key discriminator. Preserves the string the retired
  // `endpoints.publicSummary(operatorKey)` produced (`open/${operatorKey}`),
  // so the `surveysKeys.public(path)` cache identity is unchanged. The request
  // itself routes through the generated `openIndex` call.
  const path = operatorKey ? `open/${operatorKey}` : null;

  return usePublicSurvey<FilledDto>(path, ({ signal }) =>
    callSurvey(() =>
      openIndex({
        ...surveyRequest(undefined, signal),
        path: { nodeOperatorId: operatorKey as string },
      }),
    ),
  );
};
