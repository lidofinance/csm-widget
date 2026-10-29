import { getEthMaxBondAmount } from './get-eth-max-bond-amount';

describe('getEthMaxBondAmount', () => {
  it('subtracts gas cost and padding from balance', () => {
    expect(
      getEthMaxBondAmount({ balance: 1000n, gasCost: 200n, padding: 10n }),
    ).toBe(790n);
  });

  it('returns full balance when nothing is reserved (smart account)', () => {
    expect(
      getEthMaxBondAmount({ balance: 1000n, gasCost: 0n, padding: 0n }),
    ).toBe(1000n);
  });

  it('returns 0 when balance does not cover gas and padding', () => {
    expect(
      getEthMaxBondAmount({ balance: 150n, gasCost: 200n, padding: 10n }),
    ).toBe(0n);
    expect(
      getEthMaxBondAmount({ balance: 0n, gasCost: 200n, padding: 10n }),
    ).toBe(0n);
  });

  it('caps by stake limit', () => {
    expect(
      getEthMaxBondAmount({
        balance: 1000n,
        gasCost: 200n,
        padding: 10n,
        stakeLimit: 500n,
      }),
    ).toBe(500n);
  });
});
