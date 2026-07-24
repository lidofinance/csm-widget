jest.mock('config', () => ({
  config: { surveysApiUrl: 'https://surveys.test' },
}));

jest.mock('consts/external-links', () => ({
  getExternalLinks: () => ({ surveyApi: 'https://default.test' }),
}));

import { isSurveysApiConfigured, SURVEYS_API_BASE_URL } from '../surveys-api';
import { SurveysApiError, isAuthError, authErrorKind } from '../errors';

describe('surveys-api', () => {
  it('resolves base URL from config at module load', () => {
    expect(SURVEYS_API_BASE_URL).toBe('https://surveys.test');
    expect(isSurveysApiConfigured).toBe(true);
  });
});

describe('SurveysApiError envelope', () => {
  it('preserves the ApiError envelope and exposes code/details', () => {
    const err = new SurveysApiError({
      message: 'Validation failed',
      status: 400,
      url: '/x',
      body: {
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: [{ field: 'name', message: 'required' }],
      },
    });
    expect(err.code).toBe('VALIDATION_FAILED');
    expect(err.details).toHaveLength(1);
    expect(err.details).toEqual([
      { field: 'name', message: 'required', code: undefined },
    ]);
  });
});

describe('isAuthError', () => {
  it('matches 401/403 on SurveysApiError', () => {
    expect(
      isAuthError(new SurveysApiError({ message: 'x', status: 401, url: 'u' })),
    ).toBe(true);
    expect(
      isAuthError(new SurveysApiError({ message: 'x', status: 403, url: 'u' })),
    ).toBe(true);
    expect(
      isAuthError(new SurveysApiError({ message: 'x', status: 500, url: 'u' })),
    ).toBe(false);
  });

  it('returns false for non-errors', () => {
    expect(isAuthError(new Error('plain'))).toBe(false);
    expect(isAuthError(null)).toBe(false);
  });
});

describe('authErrorKind', () => {
  const makeEnvelopeError = (code: string, status = 401) =>
    new SurveysApiError({
      message: 'auth error',
      status,
      url: 'u',
      body: { code, message: 'auth error' },
    });

  it('returns reauth for AUTH_JWT_EXPIRED', () => {
    expect(authErrorKind(makeEnvelopeError('AUTH_JWT_EXPIRED'))).toBe('reauth');
  });

  it('returns logout for AUTH_JWT_INVALID', () => {
    expect(authErrorKind(makeEnvelopeError('AUTH_JWT_INVALID'))).toBe('logout');
  });

  it('returns logout for AUTH_JWT_MISSING', () => {
    expect(authErrorKind(makeEnvelopeError('AUTH_JWT_MISSING'))).toBe('logout');
  });

  it('returns logout for 401 with no envelope code (status fallback)', () => {
    expect(
      authErrorKind(
        new SurveysApiError({ message: 'x', status: 401, url: 'u' }),
      ),
    ).toBe('logout');
  });

  it('returns undefined for non-auth status (500)', () => {
    expect(
      authErrorKind(
        new SurveysApiError({ message: 'x', status: 500, url: 'u' }),
      ),
    ).toBeUndefined();
  });

  it('returns undefined for a domain 403 carrying a non-JWT code', () => {
    const err = makeEnvelopeError('OPERATOR_ACCESS_DENIED', 403);
    expect(authErrorKind(err)).toBeUndefined();
    expect(isAuthError(err)).toBe(false);
  });
});
