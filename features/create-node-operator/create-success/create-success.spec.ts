import { MODULE_NAME, OPERATOR_TYPE, ROLES } from '@lidofinance/lido-csm-sdk';
import {
  CreateSuccess,
  CreateSuccessInput,
  getCreateSuccess,
  resolveCreated,
} from './create-success';

const WALLET = '0xAbCdEf0000000000000000000000000000000001';

const input = (
  patch: Partial<CreateSuccessInput> = {},
): CreateSuccessInput => ({
  address: WALLET,
  operator: { nodeOperatorId: 420n, module: MODULE_NAME.CSM },
  type: OPERATOR_TYPE.CSM_DEF,
  roles: [],
  ...patch,
});

describe('getCreateSuccess', () => {
  it('has no role when the wallet got none', () => {
    const created = getCreateSuccess(input());
    expect(created.hasRole).toBe(false);
    expect(created.hasManagerRole).toBe(false);
    expect(created).not.toHaveProperty('roles');
  });

  it('has a role but no manager role with rewards only', () => {
    const created = getCreateSuccess(input({ roles: [ROLES.REWARDS] }));
    expect(created.hasRole).toBe(true);
    expect(created.hasManagerRole).toBe(false);
  });

  it('has the manager role when it is among the roles', () => {
    const created = getCreateSuccess(
      input({ roles: [ROLES.REWARDS, ROLES.MANAGER] }),
    );
    expect(created.hasRole).toBe(true);
    expect(created.hasManagerRole).toBe(true);
  });

  it('keeps the rest of the input', () => {
    const created = getCreateSuccess(
      input({ keys: ['0x01'], bondAmount: 5n, txHash: '0xhash' }),
    );
    expect(created.keys).toEqual(['0x01']);
    expect(created.bondAmount).toBe(5n);
    expect(created.txHash).toBe('0xhash');
    expect(created.operator).toEqual({
      nodeOperatorId: 420n,
      module: MODULE_NAME.CSM,
    });
  });
});

describe('resolveCreated', () => {
  const created: CreateSuccess = getCreateSuccess(input());

  it('is empty before anything was created', () => {
    expect(resolveCreated(undefined, WALLET)).toBeUndefined();
  });

  it('shows the success for the wallet that created it, in any case', () => {
    expect(resolveCreated(created, WALLET.toLowerCase())).toBe(created);
  });

  it('hides it for another wallet', () => {
    expect(
      resolveCreated(created, '0x0000000000000000000000000000000000000002'),
    ).toBeUndefined();
  });

  it('hides it while disconnected', () => {
    expect(resolveCreated(created, undefined)).toBeUndefined();
  });
});
