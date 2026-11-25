import {
  getNumberRangeError,
  getShownNumber,
  parseNumberInput,
} from './number-input';

describe('parseNumberInput', () => {
  it('parses integers and empty text', () => {
    expect(parseNumberInput('12')).toEqual({ text: '12', value: 12 });
    expect(parseNumberInput('')).toEqual({ text: '', value: undefined });
  });

  it('rejects letters, dots and strips minus without decimals', () => {
    expect(parseNumberInput('1a')).toBeUndefined();
    expect(parseNumberInput('1.5')).toBeUndefined();
    expect(parseNumberInput('-3')).toEqual({ text: '3', value: 3 });
  });

  it('accepts decimals up to the limit', () => {
    expect(parseNumberInput('0,05', 3)).toEqual({ text: '0.05', value: 0.05 });
    expect(parseNumberInput('.', 3)).toEqual({ text: '0.', value: 0 });
    expect(parseNumberInput('0.0501', 3)).toBeUndefined();
  });
});

describe('getShownNumber', () => {
  it('keeps typed text while it matches the value', () => {
    expect(getShownNumber('0.', 0, 2)).toBe('0.');
  });

  it('follows an external value change', () => {
    expect(getShownNumber('3', 7)).toBe('7');
    expect(getShownNumber('3', undefined)).toBe('');
  });
});

describe('getNumberRangeError', () => {
  const range = { min: 1, max: 5, minMessage: 'low', maxMessage: 'high' };

  it('returns the matching message outside the range', () => {
    expect(getNumberRangeError(0, range)).toBe('low');
    expect(getNumberRangeError(6, range)).toBe('high');
  });

  it('passes inside the range and for empty value', () => {
    expect(getNumberRangeError(1, range)).toBeUndefined();
    expect(getNumberRangeError(5, range)).toBeUndefined();
    expect(getNumberRangeError(undefined, range)).toBeUndefined();
  });
});
