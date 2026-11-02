import { MODULE_NAME, OPERATOR_TYPE, TOKENS } from '@lidofinance/lido-csm-sdk';
import { parseEther } from 'viem';
import type { CreateSuccess } from 'features/create-node-operator/create-success/create-success';
import { getCsmCreateStats } from './csm-create-stats';

jest.mock('modules/web3', () => ({}));

const created = (patch: Partial<CreateSuccess> = {}): CreateSuccess => ({
  address: '0x0000000000000000000000000000000000000001',
  operator: { nodeOperatorId: 420n, module: MODULE_NAME.CSM },
  type: OPERATOR_TYPE.CSM_DEF,
  hasRole: true,
  hasManagerRole: true,
  ...patch,
});

describe('getCsmCreateStats', () => {
  it('formats every stat', () => {
    expect(
      getCsmCreateStats(
        created({
          keys: Array.from({ length: 12 }, (_, i) => `0x${i}`),
          bondAmount: parseEther('18'),
          bondToken: TOKENS.steth,
        }),
      ),
    ).toEqual({
      operatorName: 'CSM#420',
      typeShort: '0x01',
      keysCount: 12,
      bond: '18 stETH',
    });
  });

  it('keeps bond decimals', () => {
    expect(
      getCsmCreateStats(
        created({ bondAmount: parseEther('1.5'), bondToken: TOKENS.eth }),
      ).bond,
    ).toBe('1.5 ETH');
  });

  it('names the type by its short name', () => {
    expect(
      getCsmCreateStats(created({ type: OPERATOR_TYPE.CSM_IDVTC })).typeShort,
    ).toBe('IDVTC');
  });

  it('leaves out what was not captured', () => {
    const stats = getCsmCreateStats(created());
    expect(stats.keysCount).toBeUndefined();
    expect(stats.bond).toBeUndefined();
  });
});
