import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { parseEther } from 'viem';
import { ETH_NFT_NOTE, getClaimTokenOptions } from './claim-token-options';

const maxValues = {
  [TOKENS.eth]: parseEther('0.1931'),
  [TOKENS.steth]: parseEther('0.1931'),
  [TOKENS.wsteth]: 0n,
};

describe('getClaimTokenOptions', () => {
  it('labels each option with its claimable amount', () => {
    const options = getClaimTokenOptions({ maxValues, contractLocked: false });

    expect(options.map((option) => option.value)).toEqual([
      TOKENS.eth,
      TOKENS.steth,
      TOKENS.wsteth,
    ]);
    expect(options.map((option) => option.label)).toEqual([
      '0.1931 ETH',
      '0.1931 stETH',
      '0.0 wstETH',
    ]);
  });

  it('shows the waiting time and the NFT note on ETH only', () => {
    const [eth, steth] = getClaimTokenOptions({
      maxValues,
      ethWaitingTime: '~ 3 days',
      contractLocked: false,
    });

    expect(eth.secondaryLabel).toBe('~ 3 days via withdrawal NFT');
    expect(eth.description).toBe(ETH_NFT_NOTE);
    expect(steth.secondaryLabel).toBe('~ 1 min');
    expect(steth.description).toBeUndefined();
  });

  it('keeps the NFT hint while the waiting time loads', () => {
    const [eth] = getClaimTokenOptions({ maxValues, contractLocked: false });

    expect(eth.secondaryLabel).toBe('via withdrawal NFT');
  });

  it('disables options with nothing to claim', () => {
    expect(
      getClaimTokenOptions({ maxValues, contractLocked: false }).map(
        (option) => !!option.disabled,
      ),
    ).toEqual([false, false, true]);
  });

  it('leaves only wstETH for a locked smart-contract Rewards Address', () => {
    expect(
      getClaimTokenOptions({
        maxValues: { ...maxValues, [TOKENS.wsteth]: parseEther('0.16') },
        contractLocked: true,
      }).map((option) => !!option.disabled),
    ).toEqual([true, true, false]);
  });

  it('carries the e2e testids', () => {
    const [eth] = getClaimTokenOptions({ maxValues, contractLocked: false });

    expect(eth.dataTestId).toEqual({
      root: 'tokenOption-ETH',
      label: 'tokenOptionLabel',
      secondaryLabel: 'waitingTime',
    });
  });
});
