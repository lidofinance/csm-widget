// Tests for the shared `dispatchAuthError` helper — the auth-recovery dispatch
// the three survey hooks (useSurveyQuery, useSurveyMutation, useOperatorSurvey)
// route through. This restores the coverage the retired surveys-api.test.ts had
// for `surveysRequest`'s onAuthError behavior, now that classification +
// dispatch live in one place. The critical invariant: dispatch fires ONLY when a
// token was sent, so a token-less 401 (or a domain 401/403) never wipes a
// session.

import { SurveysApiError, dispatchAuthError } from '../errors';

const TOKEN = 'Bearer tok';

const makeError = (status: number, body?: unknown): SurveysApiError =>
  new SurveysApiError({
    message: 'err',
    status,
    url: 'https://surveys.test/x',
    body,
  });

describe('dispatchAuthError', () => {
  it('fires handleAuthError("logout") on a codeless 401 when a token was sent', () => {
    const handleAuthError = jest.fn();
    dispatchAuthError(
      makeError(401, { message: 'nope' }),
      TOKEN,
      handleAuthError,
    );
    expect(handleAuthError).toHaveBeenCalledTimes(1);
    expect(handleAuthError).toHaveBeenCalledWith('logout');
  });

  it('fires handleAuthError("reauth") on AUTH_JWT_EXPIRED when a token was sent', () => {
    const handleAuthError = jest.fn();
    dispatchAuthError(
      makeError(401, { code: 'AUTH_JWT_EXPIRED', message: 'expired' }),
      TOKEN,
      handleAuthError,
    );
    expect(handleAuthError).toHaveBeenCalledWith('reauth');
  });

  it('does not fire on a 401 when no token was sent', () => {
    const handleAuthError = jest.fn();
    dispatchAuthError(
      makeError(401, { message: 'nope' }),
      undefined,
      handleAuthError,
    );
    expect(handleAuthError).not.toHaveBeenCalled();
  });

  it('does not fire on a domain 403 carrying a non-JWT code', () => {
    const handleAuthError = jest.fn();
    dispatchAuthError(
      makeError(403, { code: 'OPERATOR_ACCESS_DENIED', message: 'denied' }),
      TOKEN,
      handleAuthError,
    );
    expect(handleAuthError).not.toHaveBeenCalled();
  });

  it('does not fire on a non-auth error (500)', () => {
    const handleAuthError = jest.fn();
    dispatchAuthError(
      makeError(500, { code: 'INTERNAL', message: 'boom' }),
      TOKEN,
      handleAuthError,
    );
    expect(handleAuthError).not.toHaveBeenCalled();
  });
});
