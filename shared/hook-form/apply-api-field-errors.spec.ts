import { SurveysApiError } from 'modules/surveys-sdk/api/errors';
import { applyApiFieldErrors } from './apply-api-field-errors';

it('calls setError for each detail field, returns true when applied', () => {
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
        { message: 'no field — skipped' },
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
  expect(setError).toHaveBeenCalledTimes(2); // detail without `field` skipped
});

it('returns false for non-validation errors', () => {
  expect(applyApiFieldErrors(new Error('x'), jest.fn() as any)).toBe(false);
});
