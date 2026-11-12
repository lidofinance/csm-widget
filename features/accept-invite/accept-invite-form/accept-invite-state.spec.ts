import { MODULE_NAME, ROLES } from '@lidofinance/lido-csm-sdk';
import type { ModuleInvite } from 'modules/web3';

// 'consts' pulls in next/config, which throws outside a Next.js runtime
vi.mock('consts', () => ({
  ROLES_METADATA: {
    MANAGER: { short: 'M', capitalizedTitle: 'Manager' },
    REWARDS: { short: 'R', capitalizedTitle: 'Rewards' },
  },
}));

// eslint-disable-next-line import/first
import {
  findInviteById,
  getProposedRoleText,
  shouldNavigateHomeAfterAccept,
} from './accept-invite-state';
// eslint-disable-next-line import/first
import { getInviteId } from 'shared/node-operator/utils';

const invite = (
  module: MODULE_NAME,
  nodeOperatorId: bigint,
  role: ROLES,
): ModuleInvite => ({
  module,
  nodeOperatorId,
  role,
  curveId: 0n,
  extendedManagerPermissions: false,
});

describe('findInviteById', () => {
  const manager5 = invite(MODULE_NAME.CSM, 5n, ROLES.MANAGER);
  const manager50 = invite(MODULE_NAME.CSM, 50n, ROLES.MANAGER);
  const rewards5 = invite(MODULE_NAME.CSM, 5n, ROLES.REWARDS);
  const manager5v2 = invite(MODULE_NAME.CSM_02, 5n, ROLES.MANAGER);
  const invites = [manager50, manager5, rewards5, manager5v2];

  it('returns the invite whose id matches exactly', () => {
    expect(findInviteById(invites, getInviteId(manager5))).toBe(manager5);
    expect(findInviteById(invites, getInviteId(manager50))).toBe(manager50);
  });

  it('tells roles and modules apart for the same operator id', () => {
    expect(findInviteById(invites, getInviteId(rewards5))).toBe(rewards5);
    expect(findInviteById(invites, getInviteId(manager5v2))).toBe(manager5v2);
  });

  it('returns undefined without an id, an invites list or a match', () => {
    expect(findInviteById(invites, undefined)).toBeUndefined();
    expect(findInviteById(invites, '')).toBeUndefined();
    expect(findInviteById(undefined, getInviteId(manager5))).toBeUndefined();
    expect(findInviteById([manager50], getInviteId(manager5))).toBeUndefined();
  });
});

describe('shouldNavigateHomeAfterAccept', () => {
  it('navigates home only for a wallet without an operator and its last invite', () => {
    expect(
      shouldNavigateHomeAfterAccept({
        nodeOperatorId: undefined,
        invitesCount: 1,
      }),
    ).toBe(true);
    expect(
      shouldNavigateHomeAfterAccept({
        nodeOperatorId: undefined,
        invitesCount: 0,
      }),
    ).toBe(true);
  });

  it('stays when more invites are left', () => {
    expect(
      shouldNavigateHomeAfterAccept({
        nodeOperatorId: undefined,
        invitesCount: 2,
      }),
    ).toBe(false);
  });

  it('stays when an operator is active', () => {
    expect(
      shouldNavigateHomeAfterAccept({ nodeOperatorId: 0n, invitesCount: 1 }),
    ).toBe(false);
  });
});

describe('getProposedRoleText', () => {
  it('names the proposed role as an address', () => {
    expect(getProposedRoleText(ROLES.MANAGER)).toBe(
      'Proposed role: Manager Address',
    );
    expect(getProposedRoleText(ROLES.REWARDS)).toBe(
      'Proposed role: Rewards Address',
    );
  });
});
