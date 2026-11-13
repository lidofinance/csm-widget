import { isUprEnabled } from './is-upr-enabled';

describe('isUprEnabled', () => {
  const base = { nodeOperatorId: 1n, isCSM: true, isMainnet: true };

  it('is true for CSM on mainnet', () => {
    expect(isUprEnabled(base)).toBe(true);
  });

  it('accepts operator id 0', () => {
    expect(isUprEnabled({ ...base, nodeOperatorId: 0n })).toBe(true);
  });

  it('is false for CSM_02 and CM', () => {
    expect(isUprEnabled({ ...base, isCSM: false })).toBe(false);
  });

  it('is false on testnet', () => {
    expect(isUprEnabled({ ...base, isMainnet: false })).toBe(false);
  });

  it('is false without operator id', () => {
    expect(isUprEnabled({ ...base, nodeOperatorId: undefined })).toBe(false);
  });
});
