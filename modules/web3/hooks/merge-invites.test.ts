import { MODULE_NAME, ROLES } from '@lidofinance/lido-csm-sdk';
import { mergeInvites } from './merge-invites';

// shared/node-operator/utils pulls in 'consts' -> next/config, which throws
// outside a Next.js runtime; stub the bit getInviteId actually needs.
jest.mock('consts', () => ({
  ROLES_METADATA: {
    MANAGER: { short: 'M' },
    REWARDS: { short: 'R' },
  },
}));

// eslint-disable-next-line import/first
import { getInviteId } from 'shared/node-operator/utils';

const invite = (id: bigint, role: ROLES = ROLES.MANAGER) =>
  ({
    nodeOperatorId: id,
    extendedManagerPermissions: false,
    curveId: 0n,
    role,
  }) as any;

describe('mergeInvites', () => {
  it('tags each invite with its module and preserves group order', () => {
    const result = mergeInvites([
      { module: MODULE_NAME.CSM, invites: [invite(1n)] },
      { module: MODULE_NAME.CSM_02, invites: [invite(2n)] },
    ]);
    expect(result).toEqual([
      { ...invite(1n), module: MODULE_NAME.CSM },
      { ...invite(2n), module: MODULE_NAME.CSM_02 },
    ]);
  });

  it('skips empty per-module invite lists', () => {
    const result = mergeInvites([
      { module: MODULE_NAME.CSM, invites: [] },
      { module: MODULE_NAME.CSM_02, invites: [invite(2n)] },
    ]);
    expect(result).toEqual([{ ...invite(2n), module: MODULE_NAME.CSM_02 }]);
  });
});

describe('getInviteId', () => {
  it('produces different ids for the same nodeOperatorId and role in different modules', () => {
    const csmInvite = { ...invite(5n), module: MODULE_NAME.CSM };
    const csm02Invite = { ...invite(5n), module: MODULE_NAME.CSM_02 };

    expect(getInviteId(csmInvite)).not.toBe(getInviteId(csm02Invite));
  });
});
