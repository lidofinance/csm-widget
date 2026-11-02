import {
  EnterKeyInput,
  getBackStep,
  getNextStep,
  getRevealScrollLeft,
  getStepTrackText,
  shouldInterceptEnter,
} from './wizard';

it('getNextStep advances and clamps at the last step', () => {
  expect(getNextStep(0, 4)).toBe(1);
  expect(getNextStep(2, 4)).toBe(3);
  expect(getNextStep(3, 4)).toBe(3);
});

it('getBackStep goes back and clamps at the first step', () => {
  expect(getBackStep(2)).toBe(1);
  expect(getBackStep(0)).toBe(0);
});

const enter = (patch: Partial<EnterKeyInput> = {}): EnterKeyInput => ({
  key: 'Enter',
  tagName: 'INPUT',
  inputType: 'text',
  ...patch,
});

it.each<[string, EnterKeyInput, boolean, boolean]>([
  ['Enter in a text input before the last step', enter(), false, true],
  ['Enter in a radio input', enter({ inputType: 'radio' }), false, true],
  ['Enter on the last step', enter(), true, false],
  ['another key', enter({ key: 'a' }), false, false],
  ['IME composing', enter({ isComposing: true }), false, false],
  [
    'Enter on a button',
    enter({ tagName: 'BUTTON', inputType: 'button' }),
    false,
    false,
  ],
  ['Enter on a submit input', enter({ inputType: 'submit' }), false, false],
  [
    'Enter in a textarea',
    enter({ tagName: 'TEXTAREA', inputType: 'textarea' }),
    false,
    false,
  ],
  [
    'Enter on a link',
    enter({ tagName: 'A', inputType: undefined }),
    false,
    false,
  ],
])('shouldInterceptEnter: %s', (_name, input, isLast, expected) => {
  expect(shouldInterceptEnter(input, isLast)).toBe(expected);
});

it('getStepTrackText is 1-based and clamps when done', () => {
  expect(getStepTrackText(0, 4)).toBe('Step 1 of 4');
  expect(getStepTrackText(3, 4)).toBe('Step 4 of 4');
  expect(getStepTrackText(4, 4)).toBe('Step 4 of 4');
});

it('getRevealScrollLeft centres the item and never goes negative', () => {
  const container = { left: 0, width: 400 };
  expect(getRevealScrollLeft(container, { left: 500, width: 100 }, 0)).toBe(
    350,
  );
  expect(getRevealScrollLeft(container, { left: 150, width: 100 }, 200)).toBe(
    200,
  );
  expect(getRevealScrollLeft(container, { left: 10, width: 100 }, 0)).toBe(0);
});
