import {
  callSurvey,
  surveyRequest,
  SurveysApiError,
  type OperatorKey,
} from 'modules/surveys-sdk';
import {
  filesUpload,
  type FileMetadataDto,
  type FileUploadItemDto,
} from 'modules/surveys-sdk/generated';

// The server's 413 for an over-limit body carries no CORS header, so the
// browser blocks it and `fetch` only sees an opaque transport failure.
const SERVER_BODY_LIMIT_BYTES = 4_300_000;

// Deliberately vague about the byte limit — operators just need to split the batch.
const PAYLOAD_TOO_LARGE_MESSAGE =
  'This batch is too large to upload. Try uploading fewer files at once.';

export const uploadDkgFilesRequest = async (
  op: OperatorKey,
  files: FileUploadItemDto[],
  token: string | undefined,
): Promise<FileMetadataDto[] | undefined> => {
  try {
    return await callSurvey(() =>
      filesUpload({
        ...surveyRequest(token),
        path: { nodeOperatorId: op },
        body: files,
      }),
    );
  } catch (error) {
    // status === 0 means no Response reached us — reclassify as "payload too
    // large" only if the batch actually crosses the server's ceiling.
    if (error instanceof SurveysApiError && error.status === 0) {
      const bodyBytes = new TextEncoder().encode(
        JSON.stringify(files),
      ).byteLength;
      if (bodyBytes > SERVER_BODY_LIMIT_BYTES) {
        throw new SurveysApiError({
          message: PAYLOAD_TOO_LARGE_MESSAGE,
          status: 413,
          url: error.url || '',
          body: {
            code: 'FILES_PAYLOAD_TOO_LARGE',
            message: PAYLOAD_TOO_LARGE_MESSAGE,
          },
          cause: error,
        });
      }
    }
    throw error;
  }
};
