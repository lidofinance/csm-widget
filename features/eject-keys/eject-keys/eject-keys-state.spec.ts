import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import {
  getEjectFee,
  isHighEjectionCost,
  isNotEjectableKey,
} from './eject-keys-state';

describe('isNotEjectableKey', () => {
  it('is false for a key with the ejectable status', () => {
    expect(
      isNotEjectableKey({
        statuses: [KEY_STATUS.ACTIVE, KEY_STATUS.EJECTABLE],
      }),
    ).toBe(false);
  });

  it('is true for an active key that is not ejectable yet', () => {
    expect(isNotEjectableKey({ statuses: [KEY_STATUS.ACTIVE] })).toBe(true);
    expect(
      isNotEjectableKey({ statuses: [KEY_STATUS.ACTIVATION_PENDING] }),
    ).toBe(true);
  });
});

describe('getEjectFee', () => {
  it('is undefined while the per-key fee is unknown', () => {
    expect(getEjectFee(undefined, 2)).toBeUndefined();
  });

  it('is undefined with nothing selected', () => {
    expect(getEjectFee(1000n, 0)).toBeUndefined();
  });

  it('multiplies the per-key fee by the selected count', () => {
    expect(getEjectFee(1000n, 3)).toBe(3000n);
    expect(getEjectFee(0n, 2)).toBe(0n);
  });
});

describe('isHighEjectionCost', () => {
  it('is true at or above the threshold', () => {
    expect(isHighEjectionCost(10n, 10n)).toBe(true);
    expect(isHighEjectionCost(11n, 10n)).toBe(true);
  });

  it('is false below the threshold', () => {
    expect(isHighEjectionCost(9n, 10n)).toBe(false);
  });
});
