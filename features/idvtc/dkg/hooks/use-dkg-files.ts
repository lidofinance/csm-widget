import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyQuery,
} from 'modules/surveys-sdk';
import { filesList, type FileMetadataDto } from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { dkgFilesKey } from './dkg-keys';

export const useDkgFiles = () => {
  const op = useOperatorKey();
  return useSurveyQuery<FileMetadataDto[]>(
    dkgFilesKey(op),
    ({ token, signal }) => {
      invariant(op);
      return callSurvey(() =>
        filesList({
          ...surveyRequest(token, signal),
          path: { nodeOperatorId: op },
        }),
      );
    },
    { enabled: !!op },
  );
};
