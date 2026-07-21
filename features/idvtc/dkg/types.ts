// POST {op}/files body item
export type DkgFileUploadItem = {
  name: string;
  content: Record<string, unknown>;
};

// A file rejected during client-side validation
export type RejectedDkgFile = {
  name: string;
  reason: string;
};

export type ProcessedDkgFiles = {
  valid: DkgFileUploadItem[];
  rejected: RejectedDkgFile[];
};
