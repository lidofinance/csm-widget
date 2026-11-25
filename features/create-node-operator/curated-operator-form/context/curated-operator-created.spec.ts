import { MODULE_NAME, ROLES } from '@lidofinance/lido-csm-sdk';
import type { Address } from 'viem';
import { buildCuratedOperatorCreated } from './curated-operator-created';

const WALLET: Address = '0x00000000000000000000000000000000000000Aa';

describe('buildCuratedOperatorCreated', () => {
  it('flags the manager role', () => {
    expect(
      buildCuratedOperatorCreated({
        address: WALLET,
        nodeOperatorId: 7n,
        roles: [ROLES.REWARDS, ROLES.MANAGER],
        availableGatesCount: 3,
      }),
    ).toEqual({
      address: WALLET,
      operator: { nodeOperatorId: 7n, module: MODULE_NAME.CM },
      hasRole: true,
      hasManagerRole: true,
      availableGatesCount: 3,
    });
  });

  it('treats rewards only as a role without manager', () => {
    expect(
      buildCuratedOperatorCreated({
        address: WALLET,
        nodeOperatorId: 1n,
        roles: [ROLES.REWARDS],
        availableGatesCount: 1,
      }),
    ).toMatchObject({ hasRole: true, hasManagerRole: false });
  });

  it('treats no roles as custom addresses', () => {
    expect(
      buildCuratedOperatorCreated({
        address: WALLET,
        nodeOperatorId: 1n,
        roles: [],
        availableGatesCount: 1,
      }),
    ).toMatchObject({ hasRole: false, hasManagerRole: false });
  });
});
