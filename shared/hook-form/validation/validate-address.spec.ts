import { validateAddress } from './validate-address';
import { VALIDATION_MESSAGES } from './messages';
import { ValidationError } from './validation-error';

describe('validateAddress', () => {
  it('throws with the default message when no message given', () => {
    const run = () => validateAddress('field', '0xabc');
    expect(run).toThrow(ValidationError);
    expect(run).toThrow(VALIDATION_MESSAGES.invalidAddress);
  });

  it('throws with the custom message when one is given', () => {
    const run = () => validateAddress('field', '0xabc', 'message');
    expect(run).toThrow(ValidationError);
    expect(run).toThrow('message');
  });

  it('throws for empty string', () => {
    expect(() => validateAddress('field', '')).toThrow(ValidationError);
  });

  it('throws for undefined', () => {
    expect(() => validateAddress('field', undefined)).toThrow(ValidationError);
  });

  it('passes for a valid checksummed address', () => {
    expect(() =>
      validateAddress('field', '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'),
    ).not.toThrow();
  });
});
