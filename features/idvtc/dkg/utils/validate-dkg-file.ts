import type { DkgFileUploadItem } from '../types';

export const MAX_NAME_LENGTH = 255;
// Mirrors the API's own per-file cap (MAX_CONTENT_BYTES in is-valid-json-content.validator.ts).
export const MAX_CONTENT_BYTES = 4 * 1024 * 1024;

export type ValidateResult =
  { ok: true; item: DkgFileUploadItem } | { ok: false; reason: string };

const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;

export const byteLength = (s: string): number =>
  encoder ? encoder.encode(s).byteLength : Buffer.byteLength(s, 'utf8');

// TODO: fix types of content
const isObjectOrArray = (value: unknown): value is Record<string, unknown> =>
  (typeof value === 'object' && value !== null) || Array.isArray(value);

export const validateDkgFile = (name: string, text: string): ValidateResult => {
  if (name.length > MAX_NAME_LENGTH) {
    return {
      ok: false,
      reason: `File name exceeds ${MAX_NAME_LENGTH} characters`,
    };
  }

  let content: unknown;
  try {
    content = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'Not valid JSON' };
  }

  if (!isObjectOrArray(content)) {
    return { ok: false, reason: 'Not a valid DKG file' };
  }

  if (byteLength(JSON.stringify(content)) > MAX_CONTENT_BYTES) {
    return { ok: false, reason: 'File is larger than 4 MB' };
  }

  return { ok: true, item: { name, content } };
};
