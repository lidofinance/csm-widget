import {
  callSurvey,
  surveyRequest,
  useOperatorKey,
  useSurveyMutation,
} from 'modules/surveys-sdk';
import {
  filesUpload,
  type FileMetadataDto,
  type FileUploadItemDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { dkgFilesKey } from './dkg-keys';

export const useUploadDkgFiles = () => {
  const op = useOperatorKey();
  return useSurveyMutation<FileMetadataDto[] | undefined, FileUploadItemDto[]>(
    (body, { token }) => {
      invariant(op);
      return callSurvey(() =>
        filesUpload({
          ...surveyRequest(token),
          path: { nodeOperatorId: op },
          body,
        }),
      );
    },
    { invalidate: [dkgFilesKey(op)] },
  );
};
