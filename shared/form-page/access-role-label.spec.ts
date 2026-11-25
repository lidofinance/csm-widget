import { AccessLevel } from '@lidofinance/lido-csm-sdk';
import { getAccessRoleLabel } from './access-role-label';

describe('getAccessRoleLabel', () => {
  it.each<[AccessLevel, boolean | undefined, string | null]>([
    [AccessLevel.ANYONE, undefined, null],
    [AccessLevel.PROTOCOL_ROLE, undefined, null],
    [AccessLevel.MANAGER, undefined, 'Manager'],
    [AccessLevel.REWARDS, undefined, 'Rewards'],
    [AccessLevel.OWNER, true, 'Manager'],
    [AccessLevel.OWNER, false, 'Rewards'],
    [AccessLevel.OWNER, undefined, 'Rewards'],
    [AccessLevel.PROPOSED_MANAGER, undefined, 'Proposed Manager'],
    [AccessLevel.PROPOSED_REWARDS, undefined, 'Proposed Rewards'],
    [AccessLevel.CLAIMER, undefined, 'Manager, Rewards, or Claimer'],
  ])('%s (extended: %s) → %s', (level, extended, expected) => {
    expect(getAccessRoleLabel(level, extended)).toBe(expected);
  });
});
