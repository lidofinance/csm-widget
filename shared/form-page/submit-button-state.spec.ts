import {
  getSubmitButtonState,
  SubmitButtonState,
  SubmitButtonStateInput,
} from './submit-button-state';

const base: SubmitButtonStateInput = {
  isAccountActive: true,
  hasErrors: false,
  isDirty: true,
  isValidating: false,
  isSubmitting: false,
};

const idle: SubmitButtonState = {
  showConnect: false,
  disabled: false,
  loading: false,
};

it.each<[string, Partial<SubmitButtonStateInput>, SubmitButtonState]>([
  ['idle', {}, idle],
  [
    'wallet not active',
    { isAccountActive: false },
    { ...idle, showConnect: true },
  ],
  ['has errors', { hasErrors: true }, { ...idle, disabled: true }],
  [
    'has errors with ignoreErrors',
    { hasErrors: true, ignoreErrors: true },
    idle,
  ],
  [
    'ignoreErrors keeps other disable reasons',
    { hasErrors: true, ignoreErrors: true, disabled: true },
    { ...idle, disabled: true },
  ],
  ['disabled prop', { disabled: true }, { ...idle, disabled: true }],
  [
    'clean with disableIfClean',
    { isDirty: false, disableIfClean: true },
    { ...idle, disabled: true },
  ],
  ['dirty with disableIfClean', { isDirty: true, disableIfClean: true }, idle],
  ['clean without disableIfClean', { isDirty: false }, idle],
  ['primary submitting', { isSubmitting: true }, { ...idle, loading: true }],
  ['primary validating', { isValidating: true }, { ...idle, loading: true }],
  [
    'other intent submitting',
    { isSubmitting: true, formIntent: 'claim' },
    { ...idle, disabled: true },
  ],
  [
    'own intent submitting',
    { isSubmitting: true, formIntent: 'claim', intent: 'claim' },
    { ...idle, loading: true },
  ],
  [
    'intent button while primary submits',
    { isSubmitting: true, intent: 'claim' },
    { ...idle, disabled: true },
  ],
  ['idle intent button', { formIntent: undefined, intent: 'claim' }, idle],
])('%s', (_name, patch, expected) => {
  expect(getSubmitButtonState({ ...base, ...patch })).toEqual(expected);
});
