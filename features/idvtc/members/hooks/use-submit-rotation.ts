import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyMutation,
} from 'modules/surveys-sdk';
import {
  membersSubmitRotationRequest,
  type RotationRequestDto,
  type SubmitRotationRequestDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { membersBaseKey, rotationBaseKey } from './members-keys';

export const useSubmitRotation = () => {
  const op = useOperatorKey();
  return useSurveyMutation<
    RotationRequestDto | undefined,
    SubmitRotationRequestDto
  >(
    (body, { token }) => {
      invariant(op);
      return callSurvey(() =>
        membersSubmitRotationRequest({
          ...surveyRequest(token),
          path: { nodeOperatorId: op },
          body,
        }),
      );
    },
    { invalidate: [rotationBaseKey(op), membersBaseKey(op)] },
  );
};
