import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyMutation,
} from 'modules/surveys-sdk';
import {
  filesSetActive,
  type FileMetadataDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { dkgFilesKey } from './dkg-keys';

export const useToggleDkgFile = () => {
  const op = useOperatorKey();
  return useSurveyMutation<
    FileMetadataDto | undefined,
    { id: number; active: boolean }
  >(
    ({ id, active }, { token }) => {
      invariant(op);
      return callSurvey(() =>
        filesSetActive({
          ...surveyRequest(token),
          path: { nodeOperatorId: op, id },
          body: { active },
        }),
      );
    },
    { invalidate: [dkgFilesKey(op)] },
  );
};
