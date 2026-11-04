import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { parseEther } from 'viem';
import {
  getAddBondBalance,
  getAddBondDeltaRow,
  INSUFFICIENT_BOND_HELP,
} from './add-bond-state';

describe('getAddBondDeltaRow', () => {
  it('is undefined until the bond is loaded', () => {
    expect(getAddBondDeltaRow(undefined)).toBeUndefined();
  });

  it('labels an excess bond without a hint', () => {
    expect(
      getAddBondDeltaRow({ delta: parseEther('1.5'), isInsufficient: false }),
    ).toEqual({
      insufficient: false,
      label: 'Excess bond',
      amount: parseEther('1.5'),
    });
  });

  it('keeps a zero excess so the row always renders', () => {
    expect(getAddBondDeltaRow({ delta: 0n, isInsufficient: false })).toEqual({
      insufficient: false,
      label: 'Excess bond',
      amount: 0n,
    });
  });

  it('labels an insufficient bond with the help text', () => {
    expect(
      getAddBondDeltaRow({ delta: parseEther('0.2'), isInsufficient: true }),
    ).toEqual({
      insufficient: true,
      label: 'Insufficient bond',
      info: INSUFFICIENT_BOND_HELP,
      amount: parseEther('0.2'),
    });
  });
});

describe('getAddBondBalance', () => {
  const balances = {
    ethBalance: parseEther('1'),
    stethBalance: parseEther('2'),
    wstethBalance: parseEther('3'),
  };

  it('picks the balance of the selected token', () => {
    expect(getAddBondBalance(TOKENS.eth, balances)).toBe(parseEther('1'));
    expect(getAddBondBalance(TOKENS.steth, balances)).toBe(parseEther('2'));
    expect(getAddBondBalance(TOKENS.wsteth, balances)).toBe(parseEther('3'));
  });

  it('falls back to 0n while a balance is unknown', () => {
    expect(getAddBondBalance(TOKENS.wsteth, {})).toBe(0n);
  });
});
