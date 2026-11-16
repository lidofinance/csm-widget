import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { maxUint128 } from 'viem';
import { selectKeysStats } from './select-keys-stats';

const info = {
  totalAddedKeys: 10,
  totalDepositedKeys: 7,
  totalWithdrawnKeys: 2,
};

const activeKey = (effectiveBalance: bigint): KeyWithStatus => ({
  pubkey: '0x00',
  index: 0,
  statuses: [KEY_STATUS.ACTIVE],
  effectiveBalance,
});

describe('selectKeysStats', () => {
  it('derives active and total keys', () => {
    const stats = selectKeysStats({ info, keys: [], keysLimit: 100 });
    expect(stats.activeKeys).toBe(5);
    expect(stats.totalKeys).toBe(8);
  });

  it('passes a finite keys limit through', () => {
    expect(selectKeysStats({ info, keys: [], keysLimit: 100 }).keysLimit).toBe(
      100,
    );
  });

  it('treats missing and max-uint128 limits as unlimited', () => {
    expect(
      selectKeysStats({ info, keys: [], keysLimit: undefined }).keysLimit,
    ).toBeUndefined();
    expect(
      selectKeysStats({ info, keys: [], keysLimit: Number(maxUint128) })
        .keysLimit,
    ).toBeUndefined();
  });

  it('has zero balance while keys are loading', () => {
    expect(
      selectKeysStats({ info, keys: undefined, keysLimit: 1 }).activeBalance,
    ).toBe(0n);
  });

  it('sums the balance of active keys', () => {
    const a = 32n * 10n ** 18n;
    const b = 33n * 10n ** 18n;
    expect(
      selectKeysStats({
        info,
        keys: [activeKey(a), activeKey(b)],
        keysLimit: 1,
      }).activeBalance,
    ).toBe(a + b);
  });
});
