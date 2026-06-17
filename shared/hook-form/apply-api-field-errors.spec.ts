import { SurveysApiError } from 'modules/surveys-sdk/api/errors';
import { applyApiFieldErrors } from './apply-api-field-errors';

describe('applyApiFieldErrors', () => {
  it('calls setError per field, returns true when every detail has a field', () => {
    const setError = jest.fn();
    const err = new SurveysApiError({
      message: 'Validation failed',
      status: 400,
      url: '/x',
      body: {
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: [
          { field: 'items[0].signature', message: 'must be a string' },
          { field: 'name', message: 'required' },
        ],
      },
    });
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
    const err = new SurveysApiError({
      message: 'Validation failed',
      status: 400,
      url: '/x',
      body: {
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: [
          { field: 'items[0].signature', message: 'must be a string' },
          { message: 'no field — general message' },
        ],
      },
    });
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
    const err = new SurveysApiError({
      message: 'Validation failed',
      status: 400,
      url: '/x',
      body: {
        code: 'VALIDATION_FAILED',
        message: 'Validation failed',
        details: [{ message: 'no field here' }, { message: 'also no field' }],
      },
    });
    const applied = applyApiFieldErrors(err, setError as any);
    expect(applied).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
