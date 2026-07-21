import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';

// POST {op}/files body item — structurally identical to the generated DTO,
// aliased so the validate/process pipeline's output matches the API body.
export type DkgFileUploadItem = FileUploadItemDto;

// A file rejected during client-side validation
export type RejectedDkgFile = {
  name: string;
  reason: string;
};

export type ProcessedDkgFiles = {
  valid: DkgFileUploadItem[];
  rejected: RejectedDkgFile[];
};
