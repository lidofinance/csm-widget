import { getFieldErrorState, hasFieldValue } from './field-error-state';

const validate = { type: 'VALIDATE', message: 'Enter a valid address' };

describe('hasFieldValue', () => {
  it.each([
    ['', false],
    [null, false],
    [undefined, false],
    ['0x1', true],
    [0, true],
    [BigInt(0), true],
    [false, true],
  ])('%p -> %p', (value, expected) => {
    expect(hasFieldValue(value)).toBe(expected);
  });
});

describe('getFieldErrorState', () => {
  const pristine = { isTouched: false, isSubmitted: false, value: '' };

  it('hides an error on a pristine empty field', () => {
    expect(getFieldErrorState({ ...pristine, error: validate })).toEqual({
      invalid: false,
    });
  });

  it('shows the message once the field is touched', () => {
    expect(
      getFieldErrorState({ ...pristine, isTouched: true, error: validate }),
    ).toEqual({ invalid: true, message: 'Enter a valid address' });
  });

  it('shows the message when the field already holds a value', () => {
    expect(
      getFieldErrorState({ ...pristine, value: '0xabc', error: validate }),
    ).toEqual({ invalid: true, message: 'Enter a valid address' });
  });

  it('shows the message after a submit attempt', () => {
    expect(
      getFieldErrorState({ ...pristine, isSubmitted: true, error: validate }),
    ).toEqual({ invalid: true, message: 'Enter a valid address' });
  });

  it('shows the message on a pristine field when showUntouched is set', () => {
    expect(
      getFieldErrorState({ ...pristine, showUntouched: true, error: validate }),
    ).toEqual({ invalid: true, message: 'Enter a valid address' });
  });

  it('treats false as a value so checkbox errors show', () => {
    expect(
      getFieldErrorState({
        ...pristine,
        value: false,
        error: { type: 'VALIDATE', message: 'Please confirm' },
      }),
    ).toEqual({ invalid: true, message: 'Please confirm' });
  });

  it.each(['required', 'manual'])('shows %s errors', (type) => {
    expect(
      getFieldErrorState({
        ...pristine,
        isTouched: true,
        error: { type, message: 'Oops' },
      }),
    ).toEqual({ invalid: true, message: 'Oops' });
  });

  it('ignores error types the resolver does not produce', () => {
    expect(
      getFieldErrorState({
        ...pristine,
        isTouched: true,
        error: { type: 'maxLength', message: 'Too long' },
      }),
    ).toEqual({ invalid: false });
  });

  it('flags invalid without a message when the message is empty', () => {
    expect(
      getFieldErrorState({
        ...pristine,
        isTouched: true,
        error: { type: 'VALIDATE', message: '' },
      }),
    ).toEqual({ invalid: true, message: undefined });
  });

  it('is valid without an error', () => {
    expect(getFieldErrorState({ ...pristine, isTouched: true })).toEqual({
      invalid: false,
    });
  });
});
