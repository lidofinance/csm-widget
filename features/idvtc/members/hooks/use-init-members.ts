import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyMutation,
} from 'modules/surveys-sdk';
import {
  membersInitFromIdvtc,
  type ActiveMembersDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { membersBaseKey } from './members-keys';

export const useInitMembers = () => {
  const op = useOperatorKey();
  return useSurveyMutation<ActiveMembersDto | undefined, void>(
    (_vars, { token }) => {
      invariant(op);
      return callSurvey(() =>
        membersInitFromIdvtc({
          ...surveyRequest(token),
          path: { nodeOperatorId: op },
        }),
      );
    },
    { invalidate: [membersBaseKey(op)] },
  );
};
