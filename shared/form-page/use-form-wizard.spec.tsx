import type { KeyboardEvent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { FormWizard, useFormWizard, WizardStep } from './use-form-wizard';

const mockTrigger = jest.fn();
const mockSetValue = jest.fn();
let mockStep = 0;

jest.mock('react-hook-form', () => ({
  useFormContext: () => ({ trigger: mockTrigger, setValue: mockSetValue }),
  useWatch: () => mockStep,
}));

type Values = {
  step: number;
  gateName?: string;
  managerAddress?: string;
  name: string;
};

const STEPS: WizardStep<Values>[] = [
  { label: 'Type', fields: ['gateName'] },
  { label: 'Intro', fields: [] },
  { label: 'Name', fields: ['name'] },
  { label: 'Confirm', fields: [] },
];

let captured: FormWizard | undefined;

const Probe = () => {
  captured = useFormWizard(STEPS);
  return null;
};

const renderWizard = (step: number): FormWizard => {
  mockStep = step;
  renderToStaticMarkup(<Probe />);
  if (!captured) throw new Error('useFormWizard did not render');
  return captured;
};

const keyEvent = (target: { tagName: string; type?: string }) => {
  const preventDefault = jest.fn();
  const event = {
    key: 'Enter',
    target,
    nativeEvent: { isComposing: false },
    preventDefault,
  } as unknown as KeyboardEvent<HTMLFormElement>;
  return { event, preventDefault };
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  jest.clearAllMocks();
});

it('reports position flags', () => {
  expect(renderWizard(0)).toMatchObject({
    step: 0,
    isFirst: true,
    isLast: false,
  });
  expect(renderWizard(3)).toMatchObject({
    step: 3,
    isFirst: false,
    isLast: true,
  });
});

it('next validates the current step fields and advances when valid', async () => {
  mockTrigger.mockResolvedValue(true);
  const wizard = renderWizard(0);
  await expect(wizard.next()).resolves.toBe(true);
  expect(mockTrigger).toHaveBeenCalledWith(['gateName'], { shouldFocus: true });
  expect(mockSetValue).toHaveBeenCalledWith('step', 1);
});

it('next stays on the step when it is invalid', async () => {
  mockTrigger.mockResolvedValue(false);
  const wizard = renderWizard(2);
  await expect(wizard.next()).resolves.toBe(false);
  expect(mockTrigger).toHaveBeenCalledWith(['name'], { shouldFocus: true });
  expect(mockSetValue).not.toHaveBeenCalled();
});

it('next skips validation for a step without fields', async () => {
  const wizard = renderWizard(1);
  await expect(wizard.next()).resolves.toBe(true);
  expect(mockTrigger).not.toHaveBeenCalled();
  expect(mockSetValue).toHaveBeenCalledWith('step', 2);
});

it('back goes to the previous step and clamps at the first', () => {
  renderWizard(2).back();
  expect(mockSetValue).toHaveBeenLastCalledWith('step', 1);
  renderWizard(0).back();
  expect(mockSetValue).toHaveBeenLastCalledWith('step', 0);
});

it('Enter in an input before the last step calls next instead of submitting', async () => {
  mockTrigger.mockResolvedValue(true);
  const { event, preventDefault } = keyEvent({
    tagName: 'INPUT',
    type: 'text',
  });
  renderWizard(0).onKeyDown(event);
  expect(preventDefault).toHaveBeenCalled();
  await flush();
  expect(mockSetValue).toHaveBeenCalledWith('step', 1);
});

it('Enter on the last step submits natively', () => {
  const { event, preventDefault } = keyEvent({
    tagName: 'INPUT',
    type: 'text',
  });
  renderWizard(3).onKeyDown(event);
  expect(preventDefault).not.toHaveBeenCalled();
  expect(mockTrigger).not.toHaveBeenCalled();
});

it('Enter on a button keeps its native click', () => {
  const { event, preventDefault } = keyEvent({
    tagName: 'BUTTON',
    type: 'button',
  });
  renderWizard(0).onKeyDown(event);
  expect(preventDefault).not.toHaveBeenCalled();
});
