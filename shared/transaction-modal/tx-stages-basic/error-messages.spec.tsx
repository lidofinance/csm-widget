// shared/transaction-modal/tx-stages-basic/error-messages.spec.tsx
// get-error-code → contract-errors → track-matomo-event → consts → config →
// next.js runtime unavailable in Jest; stub before importing.
jest.mock('utils/track-matomo-event', () => ({
  trackMatomoError: jest.fn(),
}));

import { ErrorCode } from 'utils/get-error-code';
import { ERROR_META } from './error-messages';

describe('ERROR_META', () => {
  it('has an entry for every ErrorCode', () => {
    for (const code of Object.values(ErrorCode)) {
      expect(ERROR_META[code]).toBeDefined();
      expect(typeof ERROR_META[code].retryable).toBe('boolean');
    }
  });

  it('marks deterministic failures non-retryable', () => {
    expect(ERROR_META[ErrorCode.CONTRACT_ERROR].retryable).toBe(false);
    expect(ERROR_META[ErrorCode.TRANSACTION_REVERTED].retryable).toBe(false);
    expect(ERROR_META[ErrorCode.NOT_ENOUGH_ETHER].retryable).toBe(false);
    expect(ERROR_META[ErrorCode.EXECUTION_REVERTED].retryable).toBe(false);
  });
});
