import { operatorKey, parseOperatorKey } from '../url';

// Inline MODULE_NAME values to avoid pulling the full csm-sdk into the jest
// environment (which transitively resolves lido-ethereum-sdk ipfs deps).
// Keep these in sync with `@lidofinance/lido-csm-sdk`'s MODULE_NAME enum.
const CSM = 'CSM' as never;
const CSM_02 = 'CSM_02' as never;
const CM = 'CM' as never;

describe('operatorKey', () => {
  it('produces lowercase prefix with bigint', () => {
    expect(operatorKey(CSM, 42n)).toBe('csm-42');
  });

  it('produces lowercase prefix with bigint 0', () => {
    expect(operatorKey(CSM, 0n)).toBe('csm-0');
  });

  it('returns undefined when id is undefined', () => {
    expect(operatorKey(CSM, undefined)).toBeUndefined();
  });

  it('maps CSM_02 to csm02 prefix', () => {
    expect(operatorKey(CSM_02, 7n)).toBe('csm02-7');
  });

  it('handles future cm prefix', () => {
    expect(operatorKey(CM, 5n)).toBe('cm-5');
  });
});

describe('parseOperatorKey', () => {
  it('accepts well-formed csm key', () => {
    expect(parseOperatorKey('csm-42')).toBe('csm-42');
  });

  it('accepts well-formed csm02 key', () => {
    expect(parseOperatorKey('csm02-7')).toBe('csm02-7');
  });

  it('rejects csm_02 key', () => {
    expect(parseOperatorKey('csm_02-7')).toBeNull();
  });

  it('accepts well-formed cm key', () => {
    expect(parseOperatorKey('cm-7')).toBe('cm-7');
  });

  it('rejects uppercase prefix', () => {
    expect(parseOperatorKey('CSM-42')).toBeNull();
  });

  it('rejects missing id', () => {
    expect(parseOperatorKey('csm-')).toBeNull();
  });

  it('rejects unknown module', () => {
    expect(parseOperatorKey('xyz-1')).toBeNull();
  });
});
