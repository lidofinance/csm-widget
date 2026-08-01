import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { validationMessage } from 'shared/hook-form/validation/messages';
import { byteLength } from './validate-dkg-file';

// Matches the server's Fastify BODY_LIMIT (csm-survey-api/src/app/bootstrap/constants.ts).
export const MAX_TOTAL_BYTES = 4_300_000;

export const dkgBatchBytes = (files: FileUploadItemDto[]): number =>
  byteLength(JSON.stringify(files));

export const validateDkgBatch = (
  files: FileUploadItemDto[],
): string | undefined => {
  if (dkgBatchBytes(files) > MAX_TOTAL_BYTES) {
    return validationMessage.dkgBatchTooLarge(
      formatMegabytesFloor(MAX_TOTAL_BYTES),
    );
  }
  return undefined;
};

export const formatMegabytes = (bytes: number): string =>
  `${(Math.ceil((bytes / (1024 * 1024)) * 10) / 10).toFixed(1)} MB`;

export const formatMegabytesFloor = (bytes: number): string =>
  `${(Math.floor((bytes / (1024 * 1024)) * 10) / 10).toFixed(1)} MB`;
