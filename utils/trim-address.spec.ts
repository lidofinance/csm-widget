import { trimAddress } from './trim-address';

describe('trimAddress', () => {
  it('returns empty string for 0 symbols', () => {
    expect(trimAddress('0xabcdef', 0)).toBe('');
  });

  it('returns short input unchanged', () => {
    expect(trimAddress('0xabcd', 3)).toBe('0xabcd');
  });

  it('trims long input with three dots', () => {
    const key = '0x' + 'a'.repeat(96);
    expect(trimAddress(key, 16)).toBe(
      `${key.slice(0, 16)}...${key.slice(-16)}`,
    );
  });
});
