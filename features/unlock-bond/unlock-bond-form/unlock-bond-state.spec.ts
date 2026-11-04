import { parseEther } from 'viem';
import {
  getCompensationAmount,
  getRemainingLockedBond,
} from './unlock-bond-state';

const bond = (delta: string, locked: string, isInsufficient = false) => ({
  delta: parseEther(delta),
  locked: parseEther(locked),
  isInsufficient,
});

describe('getCompensationAmount', () => {
  it('is zero until the bond is loaded', () => {
    expect(getCompensationAmount(undefined, false)).toBe(0n);
  });

  it('is zero for an expired lock', () => {
    expect(getCompensationAmount(bond('5', '3'), true)).toBe(0n);
  });

  it('is zero for an insufficient bond', () => {
    expect(getCompensationAmount(bond('5', '3', true), false)).toBe(0n);
  });

  it('covers the whole lock when the excess allows it', () => {
    expect(getCompensationAmount(bond('5', '3'), false)).toBe(parseEther('3'));
  });

  it('is capped by the excess bond', () => {
    expect(getCompensationAmount(bond('1', '3'), false)).toBe(parseEther('1'));
  });
});

describe('getRemainingLockedBond', () => {
  it('subtracts the compensation from the lock', () => {
    expect(getRemainingLockedBond(parseEther('3'), parseEther('1'))).toBe(
      parseEther('2'),
    );
  });
});
