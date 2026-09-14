import { validateOptionalAddress } from './validate-optional-address';
import { ValidationError } from './validation-error';

describe('validateOptionalAddress', () => {
  it('passes for undefined', () => {
    expect(() =>
      validateOptionalAddress('field', undefined, 'message'),
    ).not.toThrow();
  });

  it('passes for empty string', () => {
    expect(() => validateOptionalAddress('field', '', 'message')).not.toThrow();
  });

  it('throws ValidationError with given message for an invalid address', () => {
    const run = () => validateOptionalAddress('field', '0xabc', 'message');
    expect(run).toThrow(ValidationError);
    expect(run).toThrow('message');
  });

  it('passes for a valid checksummed address', () => {
    expect(() =>
      validateOptionalAddress(
        'field',
        '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        'message',
      ),
    ).not.toThrow();
  });
});
