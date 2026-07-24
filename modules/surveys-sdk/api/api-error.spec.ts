import { parseApiError, getApiErrorCode, isValidationError } from './api-error';

describe('parseApiError', () => {
  it('should return parsed ApiError for a well-formed envelope', () => {
    const e = parseApiError({
      code: 'ICS_NOT_REJECTED',
      message: 'nope',
      details: [{ field: 'a', message: 'bad' }],
    });
    expect(e).toEqual({
      code: 'ICS_NOT_REJECTED',
      message: 'nope',
      details: [{ field: 'a', message: 'bad' }],
    });
  });

  it('should return undefined when body is not an envelope', () => {
    expect(parseApiError({ foo: 1 })).toBeUndefined();
    expect(parseApiError(null)).toBeUndefined();
  });

  it('should omit details when the filtered array is empty', () => {
    const e = parseApiError({ code: 'X', message: 'm', details: [] });
    expect(e).toEqual({ code: 'X', message: 'm' });
    expect(e).not.toHaveProperty('details');
  });

  it('should drop detail items whose message is not a string', () => {
    const e = parseApiError({
      code: 'X',
      message: 'm',
      details: [{ message: 42 }, { field: 'x', message: 'ok' }],
    });
    expect(e?.details).toEqual([
      { field: 'x', message: 'ok', code: undefined },
    ]);
  });
});

describe('getApiErrorCode', () => {
  it('should return code string when present', () => {
    expect(getApiErrorCode({ code: 'X', message: 'm' })).toBe('X');
  });

  it('should return undefined when code is missing', () => {
    expect(getApiErrorCode({ message: 'm' })).toBeUndefined();
    expect(getApiErrorCode(null)).toBeUndefined();
  });
});

describe('isValidationError', () => {
  it('should return true for VALIDATION_FAILED with valid message', () => {
    expect(isValidationError({ code: 'VALIDATION_FAILED', message: 'm' })).toBe(
      true,
    );
  });

  it('should return false for a different code', () => {
    expect(isValidationError({ code: 'OTHER', message: 'm' })).toBe(false);
  });

  it('should return false when code matches but message is missing', () => {
    expect(isValidationError({ code: 'VALIDATION_FAILED' })).toBe(false);
  });
});
