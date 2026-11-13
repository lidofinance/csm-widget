import {
  formatPercentInput,
  getShownPercent,
  parsePercentInput,
} from './percent-input';

const MAX = 10000n;

describe('formatPercentInput', () => {
  it.each([
    [undefined, ''],
    [null, ''],
    [0n, '0.00'],
    [1250n, '12.50'],
    [10000n, '100.00'],
  ])('%p -> %p', (value, expected) => {
    expect(formatPercentInput(value)).toBe(expected);
  });
});

describe('parsePercentInput', () => {
  it.each([
    ['', { text: '', value: null }],
    [' ', { text: '', value: null }],
    ['12', { text: '12', value: 1200n }],
    ['12.5', { text: '12.5', value: 1250n }],
    ['12,55', { text: '12.55', value: 1255n }],
    ['-3', { text: '3', value: 300n }],
    ['.', { text: '0.', value: 0n }],
    ['0.01', { text: '0.01', value: 1n }],
  ])('accepts %p', (raw, expected) => {
    expect(parsePercentInput(raw, MAX)).toEqual(expected);
  });

  it.each(['abc', '1.234', '1..2', '1e2'])('rejects %p', (raw) => {
    expect(parsePercentInput(raw, MAX)).toBeUndefined();
  });

  it('caps the value at maxValue and rewrites the text', () => {
    expect(parsePercentInput('120', MAX)).toEqual({
      text: '100.00',
      value: MAX,
    });
    expect(parsePercentInput('60', 5000n)).toEqual({
      text: '50.00',
      value: 5000n,
    });
  });

  it('clamps absurdly long input', () => {
    expect(parsePercentInput('9'.repeat(400), MAX)).toEqual({
      text: '100.00',
      value: MAX,
    });
  });
});

describe('getShownPercent', () => {
  it('keeps the typed text while it means the value', () => {
    expect(getShownPercent('10.5', 1050n, MAX)).toBe('10.5');
    expect(getShownPercent('', null, MAX)).toBe('');
  });

  it('formats the value when it changed elsewhere', () => {
    expect(getShownPercent('10.5', 2000n, MAX)).toBe('20.00');
    expect(getShownPercent('10.5', undefined, MAX)).toBe('');
  });
});
