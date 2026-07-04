// shared/transaction-modal/tx-stages-basic/error-messages.spec.tsx
// get-error-code → contract-errors → track-matomo-event → consts → config →
// next.js runtime unavailable in Jest; stub before importing.
jest.mock('utils/track-matomo-event', () => ({
  trackMatomoError: jest.fn(),
}));

import { ErrorCode } from 'utils/get-error-code';
import { ERROR_META } from './error-messages';

describe('ERROR_META', () => {
  it('marks retryable codes as retryable', () => {
    expect(ERROR_META[ErrorCode.DENIED_SIG].retryable).toBe(true);
    expect(ERROR_META[ErrorCode.NETWORK_ERROR].retryable).toBe(true);
    expect(ERROR_META[ErrorCode.CHAIN_MISMATCH].retryable).toBe(true);
    expect(ERROR_META[ErrorCode.SESSION_EXPIRED].retryable).toBe(true);
  });

  it('marks deterministic failures non-retryable', () => {
    expect(ERROR_META[ErrorCode.CONTRACT_ERROR].retryable).toBe(false);
    expect(ERROR_META[ErrorCode.TRANSACTION_REVERTED].retryable).toBe(false);
    expect(ERROR_META[ErrorCode.NOT_ENOUGH_ETHER].retryable).toBe(false);
    expect(ERROR_META[ErrorCode.EXECUTION_REVERTED].retryable).toBe(false);
  });
});
