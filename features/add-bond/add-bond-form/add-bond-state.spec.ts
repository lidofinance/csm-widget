import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { parseEther } from 'viem';
import { getAddBondBalance } from './add-bond-state';

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
