import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { renderToStaticMarkup } from 'react-dom/server';
import { parseEther } from 'viem';
import { getBondTokenOptions } from './bond-token-options';

const balances = {
  ethBalance: parseEther('1.5'),
  stethBalance: parseEther('24.191234'),
  wstethBalance: 0n,
};

describe('getBondTokenOptions', () => {
  it('lists ETH, stETH and wstETH with the token as the value', () => {
    expect(getBondTokenOptions(balances).map((option) => option.value)).toEqual(
      [TOKENS.eth, TOKENS.steth, TOKENS.wsteth],
    );
  });

  it('labels each option with the balance trimmed to 4 decimals', () => {
    expect(getBondTokenOptions(balances).map((option) => option.label)).toEqual(
      ['1.5 ETH', '24.1912 stETH', '0.0 wstETH'],
    );
  });

  it('puts the e2e testid on every option', () => {
    expect(
      getBondTokenOptions(balances).map((option) => option.dataTestId?.root),
    ).toEqual(['tokenOption-ETH', 'tokenOption-stETH', 'tokenOption-wstETH']);
  });

  it('shows the key capacity only when it is known', () => {
    const options = getBondTokenOptions({
      ...balances,
      keysAvailable: {
        [TOKENS.eth]: { count: 1 },
        [TOKENS.steth]: { count: 2 },
      },
    });

    expect(options.map((option) => option.secondaryLabel)).toEqual([
      '1 key',
      '2 keys',
      undefined,
    ]);
    expect(
      getBondTokenOptions(balances).every(
        (option) => option.secondaryLabel === undefined,
      ),
    ).toBe(true);
  });

  it('renders a token icon for every option', () => {
    getBondTokenOptions(balances).forEach((option) => {
      expect(renderToStaticMarkup(<>{option.icon}</>)).toContain('<svg');
    });
  });
});
