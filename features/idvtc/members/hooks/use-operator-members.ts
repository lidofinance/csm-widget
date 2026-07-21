import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyQuery,
} from 'modules/surveys-sdk';
import {
  membersList,
  type ActiveMembersDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { membersBaseKey } from './members-keys';

export const useOperatorMembers = () => {
  const op = useOperatorKey();
  return useSurveyQuery<ActiveMembersDto | null>(
    membersBaseKey(op),
    ({ token, signal }) => {
      invariant(op);
      return callSurvey(() =>
        membersList({
          ...surveyRequest(token, signal),
          path: { nodeOperatorId: op },
        }),
      );
    },
    { enabled: !!op },
  );
};
