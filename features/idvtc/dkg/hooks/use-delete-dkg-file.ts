import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyMutation,
} from 'modules/surveys-sdk';
import { filesRemove } from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { dkgFilesKey } from './dkg-keys';

export const useDeleteDkgFile = () => {
  const op = useOperatorKey();
  return useSurveyMutation<void, number>(
    (id, { token }) => {
      invariant(op);
      return callSurvey(() =>
        filesRemove({
          ...surveyRequest(token),
          path: { nodeOperatorId: op, id },
        }),
      ) as Promise<void>;
    },
    { invalidate: [dkgFilesKey(op)] },
  );
};
