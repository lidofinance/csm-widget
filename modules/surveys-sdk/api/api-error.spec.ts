import { parseApiError, getApiErrorCode, isValidationError } from './api-error';

describe('parseApiError', () => {
  it('parses a well-formed envelope', () => {
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

  it('returns undefined for a non-envelope body', () => {
    expect(parseApiError({ foo: 1 })).toBeUndefined();
    expect(parseApiError(null)).toBeUndefined();
  });
});

describe('helpers', () => {
  it('getApiErrorCode reads code', () => {
    expect(getApiErrorCode({ code: 'X', message: 'm' })).toBe('X');
  });
  it('isValidationError detects VALIDATION_FAILED', () => {
    expect(isValidationError({ code: 'VALIDATION_FAILED', message: 'm' })).toBe(
      true,
    );
    expect(isValidationError({ code: 'OTHER', message: 'm' })).toBe(false);
  });
});
