import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyQuery,
} from 'modules/surveys-sdk';
import {
  membersGetRotationRequest,
  type RotationRequestDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { rotationBaseKey } from './members-keys';

// `enabled` lets the caller defer the request until members are known to exist
// (an uninitialized operator has no rotation request to read).
export const useRotationRequest = (enabled = true) => {
  const op = useOperatorKey();
  return useSurveyQuery<RotationRequestDto | null>(
    rotationBaseKey(op),
    ({ token, signal }) => {
      invariant(op);
      return callSurvey(() =>
        membersGetRotationRequest({
          ...surveyRequest(token, signal),
          path: { nodeOperatorId: op },
        }),
      );
    },
    { enabled: !!op && enabled },
  );
};
