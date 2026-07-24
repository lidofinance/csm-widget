import { useOperatorKey, useSurveyMutation } from 'modules/surveys-sdk';
import type {
  FileMetadataDto,
  FileUploadItemDto,
} from 'modules/surveys-sdk/generated';
import invariant from 'tiny-invariant';
import { trackMatomoRawError } from 'utils/track-matomo-event';
import { dkgFilesKey } from './dkg-keys';
import { uploadDkgFilesRequest } from './upload-dkg-files-request';

export const useUploadDkgFiles = () => {
  const op = useOperatorKey();
  return useSurveyMutation<FileMetadataDto[] | undefined, FileUploadItemDto[]>(
    (body, { token }) => {
      invariant(op);
      return uploadDkgFilesRequest(op, body, token);
    },
    {
      invalidate: [dkgFilesKey(op)],
      onError: (err) => trackMatomoRawError('dkg_upload_page', err),
    },
  );
};
