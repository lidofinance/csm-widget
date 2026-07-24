// The stable error envelope returned by every non-2xx csm-survey-api response.
// `code` is the public contract (SCREAMING_SNAKE) — branch on it, never on
// status or message. See docs/api-errors-guide.md.
import type {
  ApiErrorDetailDto,
  ApiErrorDto,
} from 'modules/surveys-sdk/generated';

// Aliases to the generated DTO types (shapes are identical).
export type ApiErrorDetail = ApiErrorDetailDto;
export type ApiError = ApiErrorDto;

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

// Narrow an unknown parsed JSON body to ApiError, or undefined when it is not
// the envelope (legacy endpoint, gateway HTML, etc.).
export const parseApiError = (body: unknown): ApiError | undefined => {
  if (!isRecord(body)) return undefined;
  if (typeof body.code !== 'string' || typeof body.message !== 'string')
    return undefined;
  const out: ApiError = { code: body.code, message: body.message };
  if (Array.isArray(body.details)) {
    const filtered = body.details
      .filter(isRecord)
      .filter((d) => typeof d.message === 'string')
      .map((d) => ({
        field: typeof d.field === 'string' ? d.field : undefined,
        code: typeof d.code === 'string' ? d.code : undefined,
        message: d.message as string,
      }));
    if (filtered.length > 0) out.details = filtered;
  }
  return out;
};

export const getApiErrorCode = (e: unknown): string | undefined =>
  isRecord(e) && typeof e.code === 'string' ? e.code : undefined;

export const isValidationError = (e: unknown): e is ApiError =>
  parseApiError(e)?.code === 'VALIDATION_FAILED';
