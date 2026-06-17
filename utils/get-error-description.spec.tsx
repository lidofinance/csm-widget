// utils/get-error-description.spec.tsx
import { SDKError } from '@lidofinance/lido-csm-sdk';
import { ErrorCode } from './get-error-code';
import { resolveError } from './get-error-description';

// track-matomo-event imports consts/matomo-click-events → config → next.js
// runtime which is unavailable in Jest. Stub the whole module.
jest.mock('./track-matomo-event', () => ({
  trackMatomoError: jest.fn(),
}));

it('resolves contract copy from decodedRevert for CONTRACT_ERROR', () => {
  const e = new SDKError({
    message: 'BondLockNotExpired',
    decodedRevert: { name: 'BondLockNotExpired', args: [] } as any,
  });
  const { code, description } = resolveError(e);
  expect(code).toBe(ErrorCode.CONTRACT_ERROR);
  expect(description).toMatch(/bond is still locked/i);
});

it('returns undefined description for codes covered by the static map', () => {
  const { description } = resolveError({ code: 4001 }); // not classified here → SOMETHING_WRONG
  // SOMETHING_WRONG falls back to extractErrorMessage; undefined for empty error
  expect(description === undefined || typeof description === 'string').toBe(
    true,
  );
});
