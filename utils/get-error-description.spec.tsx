// utils/get-error-description.spec.tsx
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SDKError } from '@lidofinance/lido-csm-sdk';
import { ErrorCode } from './get-error-code';
import { getErrorDescription, resolveError } from './get-error-description';

// track-matomo-event imports consts/matomo-click-events → config → next.js
// runtime which is unavailable in Jest. Stub the whole module.
jest.mock('./track-matomo-event', () => ({
  trackMatomoError: jest.fn(),
}));

// Helper to build a SurveysApiError-shaped plain object.
const surveyError = (
  status: number,
  apiError?: {
    code?: string;
    message?: string;
    details?: { field?: string; message: string }[];
  },
) => ({
  name: 'SurveysApiError' as const,
  status,
  apiError: apiError ? { message: 'server msg', ...apiError } : undefined,
  get code() {
    return this.apiError?.code;
  },
});

it('resolves contract copy from decodedRevert for CONTRACT_ERROR', () => {
  const e = new SDKError({
    message: 'BondLockNotExpired',
    decodedRevert: { name: 'BondLockNotExpired', args: [] } as any,
  });
  const { code, description } = resolveError(e);
  expect(code).toBe(ErrorCode.CONTRACT_ERROR);
  expect(description).toMatch(/bond is still locked/i);
});

it('returns undefined description when SOMETHING_WRONG error has no message', () => {
  // Plain object with no message/reason/error → extractErrorMessage returns undefined
  const { description } = resolveError({ code: 4001 });
  expect(description).toBeUndefined();
});

describe('getErrorDescription (SurveysApiError path)', () => {
  it('returns undefined for AUTH_JWT_EXPIRED (SESSION_EXPIRED uses static copy)', () => {
    const e = surveyError(401, { code: 'AUTH_JWT_EXPIRED' });
    const desc = getErrorDescription(e, ErrorCode.SESSION_EXPIRED);
    expect(desc).toBeUndefined();
  });

  it('returns undefined for AUTH_JWT_INVALID (SESSION_EXPIRED uses static copy)', () => {
    const e = surveyError(401, { code: 'AUTH_JWT_INVALID' });
    const desc = getErrorDescription(e, ErrorCode.SESSION_EXPIRED);
    expect(desc).toBeUndefined();
  });

  it('returns undefined for AUTH_JWT_MISSING (SESSION_EXPIRED uses static copy)', () => {
    const e = surveyError(401, { code: 'AUTH_JWT_MISSING' });
    const desc = getErrorDescription(e, ErrorCode.SESSION_EXPIRED);
    expect(desc).toBeUndefined();
  });

  it('returns domain copy for a known non-auth code', () => {
    const e = surveyError(422, { code: 'MEMBERS_DUPLICATE_ADDRESS' });
    const desc = getErrorDescription(e, ErrorCode.SOMETHING_WRONG);
    expect(desc).toMatch(/appears more than once/i);
  });

  it('falls back to server message for an unknown code', () => {
    const e = surveyError(422, {
      code: 'TOTALLY_NEW_CODE',
      message: 'raw msg',
    });
    const desc = getErrorDescription(e, ErrorCode.SOMETHING_WRONG);
    expect(desc).toBe('raw msg');
  });

  it('renders domain copy + details list for VALIDATION_FAILED', () => {
    const e = surveyError(422, {
      code: 'VALIDATION_FAILED',
      message: 'invalid',
      details: [
        { field: 'email', message: 'Invalid email' },
        { field: 'name', message: 'Too short' },
      ],
    });
    const desc = getErrorDescription(e, ErrorCode.SOMETHING_WRONG);
    expect(desc).not.toBeUndefined();
    const html = renderToStaticMarkup(desc as React.ReactElement);
    expect(html).toContain('<ul>');
    expect(html).toContain('Invalid email');
    expect(html).toContain('Too short');
    expect(html.toLowerCase()).toContain('fix the highlighted');
  });

  it('returns undefined when apiError is absent', () => {
    const e = surveyError(500);
    const desc = getErrorDescription(e, ErrorCode.SERVER_ERROR);
    expect(desc).toBeUndefined();
  });
});
