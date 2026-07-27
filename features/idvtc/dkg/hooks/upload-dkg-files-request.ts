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

// The csm-survey-api's Fastify `BODY_LIMIT` — the hard ceiling on the ENTIRE
// request body (this endpoint POSTs the whole batch as one JSON array), not
// the 4 MB per-file cap enforced client-side in validate-dkg-file.ts. A batch
// over this line gets a real 413 from the server, but that 413 carries no
// Access-Control-Allow-Origin header, so the browser blocks it and `fetch`
// rejects before any HTTP status ever reaches us (see the opaque-transport-
// failure detection below).
const SERVER_BODY_LIMIT_BYTES = 6 * 1024 * 1024;

// Operator-facing copy for the synthesized FILES_PAYLOAD_TOO_LARGE code below
// (see the matching entry + comment in consts/survey-api-copy.ts). Deliberately
// silent about the 6 MiB number and the transport mechanics — operators just
// need to know to split the batch.
const PAYLOAD_TOO_LARGE_MESSAGE =
  'This batch is too large to upload. Try uploading fewer files at once.';

// Single source of truth for the DKG files POST, shared by the standalone page
// mutation (useUploadDkgFiles) and the in-flow upload (useDkgInFlowUpload) so
// the endpoint shape and path stay in one place. The token is passed in — never
// read from a closure — so a first-time sign-in threads the fresh token here.
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
    // `status === 0` is the signal survey-client's error interceptor uses for
    // an opaque transport failure — no Response ever reached us (network
    // outage, or exactly the CORS-blocked 413 described above). Only reclassify
    // it as "payload too large" when the batch actually crosses the server's
    // ceiling; below that line an opaque failure is a genuine network problem
    // and must keep its own error. Computed lazily here (not up front) so the
    // success path never pays for a second multi-MB JSON.stringify.
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
