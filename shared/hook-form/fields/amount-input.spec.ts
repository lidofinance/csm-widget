import { parseEther } from 'viem';
import {
  formatAmountInput,
  getShownAmount,
  parseAmountInput,
} from './amount-input';

describe('formatAmountInput', () => {
  it.each([
    [undefined, ''],
    [null, ''],
    [0n, '0'],
    [parseEther('2.4'), '2.4'],
    [parseEther('1.5'), '1.5'],
  ])('%p -> %p', (value, expected) => {
    expect(formatAmountInput(value)).toBe(expected);
  });
});

describe('parseAmountInput', () => {
  it.each([
    ['', { text: '', value: null }],
    ['  ', { text: '', value: null }],
    ['1.5', { text: '1.5', value: parseEther('1.5') }],
    ['1,5', { text: '1.5', value: parseEther('1.5') }],
    ['-2', { text: '2', value: parseEther('2') }],
    ['.', { text: '0.', value: 0n }],
    ['0.10', { text: '0.10', value: parseEther('0.1') }],
  ])('accepts %p', (raw, expected) => {
    expect(parseAmountInput(raw)).toEqual(expected);
  });

  it.each(['abc', '1.2.3', '1e5', '0x10', '0.1234567890123456789'])(
    'rejects %p',
    (raw) => {
      expect(parseAmountInput(raw)).toBeUndefined();
    },
  );
});

describe('getShownAmount', () => {
  it('keeps the typed text while it parses to the field value', () => {
    expect(getShownAmount('0.10', parseEther('0.1'))).toBe('0.10');
    expect(getShownAmount('', undefined)).toBe('');
  });

  it('shows the field value when it was changed from outside', () => {
    expect(getShownAmount('1', parseEther('2.4'))).toBe('2.4');
    expect(getShownAmount('1', undefined)).toBe('');
  });
});
