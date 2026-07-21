import { useOperatorKey, useSurveyMutation } from 'modules/surveys-sdk';
import type {
  FileMetadataDto,
  FileUploadItemDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { dkgFilesKey } from './dkg-keys';
import { uploadDkgFilesRequest } from './upload-dkg-files-request';

export const useUploadDkgFiles = () => {
  const op = useOperatorKey();
  return useSurveyMutation<FileMetadataDto[] | undefined, FileUploadItemDto[]>(
    (body, { token }) => {
      invariant(op);
      return uploadDkgFilesRequest(op, body, token);
    },
    { invalidate: [dkgFilesKey(op)] },
  );
};
