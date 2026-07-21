import { SurveysApiError } from 'modules/surveys-sdk/api/errors';
import { applyApiFieldErrors } from './apply-api-field-errors';

const validationError = (
  details: Array<{ field?: string; message: string }>,
): SurveysApiError =>
  new SurveysApiError({
    message: 'Validation failed',
    status: 400,
    url: '/x',
    body: {
      code: 'VALIDATION_FAILED',
      message: 'Validation failed',
      details,
    },
  });

describe('applyApiFieldErrors', () => {
  it('calls setError per field, returns true when every detail has a field', () => {
    const setError = jest.fn();
    const err = validationError([
      { field: 'items[0].signature', message: 'must be a string' },
      { field: 'name', message: 'required' },
    ]);
    const applied = applyApiFieldErrors(err, setError as any);
    expect(applied).toBe(true);
    expect(setError).toHaveBeenCalledWith('items[0].signature', {
      type: 'server',
      message: 'must be a string',
    });
    expect(setError).toHaveBeenCalledWith('name', {
      type: 'server',
      message: 'required',
    });
    expect(setError).toHaveBeenCalledTimes(2);
  });

  it('applies field errors but returns false when a detail lacks a field', () => {
    const setError = jest.fn();
    const err = validationError([
      { field: 'items[0].signature', message: 'must be a string' },
      { message: 'no field — general message' },
    ]);
    const applied = applyApiFieldErrors(err, setError as any);
    // Suppressing the modal would drop the fieldless message, so show it.
    expect(applied).toBe(false);
    // Field detail still gets surfaced inline.
    expect(setError).toHaveBeenCalledWith('items[0].signature', {
      type: 'server',
      message: 'must be a string',
    });
    expect(setError).toHaveBeenCalledTimes(1);
  });

  it('returns false for non-validation errors', () => {
    expect(applyApiFieldErrors(new Error('x'), jest.fn() as any)).toBe(false);
  });

  it('returns false when all details lack a field property', () => {
    const setError = jest.fn();
    const err = validationError([
      { message: 'no field here' },
      { message: 'also no field' },
    ]);
    const applied = applyApiFieldErrors(err, setError as any);
    expect(applied).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });

  describe('with knownFields', () => {
    it('returns true and applies each error when all fields are known', () => {
      const setError = jest.fn();
      const err = validationError([
        { field: 'name', message: 'required' },
        { field: 'twitterLink', message: 'invalid url' },
      ]);
      const applied = applyApiFieldErrors(err, setError as any, [
        'name',
        'twitterLink',
      ]);
      expect(applied).toBe(true);
      expect(setError).toHaveBeenCalledWith('name', {
        type: 'server',
        message: 'required',
      });
      expect(setError).toHaveBeenCalledWith('twitterLink', {
        type: 'server',
        message: 'invalid url',
      });
      expect(setError).toHaveBeenCalledTimes(2);
    });

    it('returns false and skips setError for an unknown field', () => {
      const setError = jest.fn();
      const err = validationError([
        { field: 'name', message: 'required' },
        { field: 'unknownServerField', message: 'something off' },
      ]);
      const applied = applyApiFieldErrors(err, setError as any, ['name']);
      // Modal must show so the unknown-field message is not lost.
      expect(applied).toBe(false);
      // Known field still surfaced inline.
      expect(setError).toHaveBeenCalledWith('name', {
        type: 'server',
        message: 'required',
      });
      // Phantom field must NOT be registered (would freeze the form).
      expect(setError).not.toHaveBeenCalledWith(
        'unknownServerField',
        expect.anything(),
      );
      expect(setError).toHaveBeenCalledTimes(1);
    });

    it('returns false when a fieldless detail is mixed with known fields', () => {
      const setError = jest.fn();
      const err = validationError([
        { field: 'name', message: 'required' },
        { message: 'general server message' },
      ]);
      const applied = applyApiFieldErrors(err, setError as any, ['name']);
      expect(applied).toBe(false);
      expect(setError).toHaveBeenCalledWith('name', {
        type: 'server',
        message: 'required',
      });
      expect(setError).toHaveBeenCalledTimes(1);
    });

    it('treats a nested path as known by its root segment', () => {
      const setError = jest.fn();
      const err = validationError([
        { field: 'additionalAddresses[0]', message: 'invalid address' },
      ]);
      const applied = applyApiFieldErrors(err, setError as any, [
        'additionalAddresses',
      ]);
      expect(applied).toBe(true);
      expect(setError).toHaveBeenCalledWith('additionalAddresses[0]', {
        type: 'server',
        message: 'invalid address',
      });
      expect(setError).toHaveBeenCalledTimes(1);
    });
  });
});
