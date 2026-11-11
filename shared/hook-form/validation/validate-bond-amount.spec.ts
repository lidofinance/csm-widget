jest.mock('utils', () => jest.requireActual('utils/get-token-display-name'));

import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { validateBondAmount } from './validate-bond-amount';

const base = {
  token: TOKENS.steth,
  bondAmount: 10n,
  maxStakeEth: 100n,
  ethBalance: 0n,
  stethBalance: 5n,
  wstethBalance: 0n,
};

const messageOf = (props: Parameters<typeof validateBondAmount>[0]) => {
  try {
    validateBondAmount(props);
  } catch (e) {
    return (e as Error).message;
  }
  return undefined;
};

describe('validateBondAmount', () => {
  it('reports affordable keys when below uploaded', () => {
    expect(
      messageOf({ ...base, affordableKeys: { count: 2, uploaded: 5 } }),
    ).toBe('Cannot upload more than 2 keys according to your wallet balance');
  });

  it('falls back to the balance message without affordableKeys', () => {
    expect(messageOf(base)).toBe('Not enough balance of stETH');
  });

  it('falls back when affordable covers uploaded', () => {
    expect(
      messageOf({ ...base, affordableKeys: { count: 5, uploaded: 5 } }),
    ).toBe('Not enough balance of stETH');
  });

  it('ETH stake limit wins', () => {
    expect(
      messageOf({
        ...base,
        token: TOKENS.eth,
        maxStakeEth: 1n,
        ethBalance: 0n,
        affordableKeys: { count: 0, uploaded: 5 },
      }),
    ).toContain('stake limit');
  });
});
