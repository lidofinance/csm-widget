import type { Address } from 'viem';
import { hasOperatorRole } from './has-operator-role';

describe('hasOperatorRole', () => {
  const MANAGER: Address = '0xabcdef0000000000000000000000000000000001';
  const REWARDS: Address = '0xabcdef0000000000000000000000000000000002';
  const CLAIMER: Address = '0xabcdef0000000000000000000000000000000003';

  const operator = { managerAddress: MANAGER, rewardsAddress: REWARDS };

  it('is true for the manager address', () => {
    expect(hasOperatorRole(operator, MANAGER)).toBe(true);
  });

  it('is true for the rewards address', () => {
    expect(hasOperatorRole(operator, REWARDS)).toBe(true);
  });

  it('is false for an address that is only claimer', () => {
    expect(hasOperatorRole(operator, CLAIMER)).toBe(false);
  });

  it('is false when address is undefined', () => {
    expect(hasOperatorRole(operator, undefined)).toBe(false);
  });

  it('matches case-insensitively', () => {
    const upperCased: Address = `0x${MANAGER.slice(2).toUpperCase()}`;
    expect(upperCased).not.toBe(MANAGER);
    expect(hasOperatorRole(operator, upperCased)).toBe(true);
  });
});
