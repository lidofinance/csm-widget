import type { DkgFileUploadItem } from '../types';

export const MAX_NAME_LENGTH = 255;
export const MAX_CONTENT_BYTES = 64 * 1024; // 64 KB after JSON.stringify

export type ValidateResult =
  { ok: true; item: DkgFileUploadItem } | { ok: false; reason: string };

const encoder = typeof TextEncoder !== 'undefined' ? new TextEncoder() : null;

const byteLength = (s: string): number =>
  encoder ? encoder.encode(s).byteLength : Buffer.byteLength(s, 'utf8');

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

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

  if (!isPlainObject(content)) {
    return { ok: false, reason: 'Not a valid DKG file' };
  }

  if (byteLength(JSON.stringify(content)) > MAX_CONTENT_BYTES) {
    return { ok: false, reason: 'File is larger than 64 KB' };
  }

  return { ok: true, item: { name, content } };
};
