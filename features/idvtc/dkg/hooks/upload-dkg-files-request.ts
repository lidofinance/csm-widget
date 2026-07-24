import {
  callSurvey,
  surveyRequest,
  type OperatorKey,
} from 'modules/surveys-sdk';
import {
  filesUpload,
  type FileMetadataDto,
  type FileUploadItemDto,
} from 'modules/surveys-sdk/generated';

// Single source of truth for the DKG files POST, shared by the standalone page
// mutation (useUploadDkgFiles) and the in-flow upload (useDkgInFlowUpload) so
// the endpoint shape and path stay in one place. The token is passed in — never
// read from a closure — so a first-time sign-in threads the fresh token here.
export const uploadDkgFilesRequest = (
  op: OperatorKey,
  files: FileUploadItemDto[],
  token: string | undefined,
): Promise<FileMetadataDto[] | undefined> =>
  callSurvey(() =>
    filesUpload({
      ...surveyRequest(token),
      path: { nodeOperatorId: op },
      body: files,
    }),
  );
