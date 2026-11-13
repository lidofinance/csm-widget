import { KeyboardEventHandler, useCallback } from 'react';
import {
  FieldPath,
  FieldValues,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { getBackStep, getNextStep, shouldInterceptEnter } from './wizard';

export type WizardStep<T extends FieldValues> = {
  label: string;
  fields: FieldPath<T>[];
};

export type FormWizard = {
  step: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => Promise<boolean>;
  back: () => void;
  onKeyDown: KeyboardEventHandler<HTMLFormElement>;
};

type WizardFormInput = {
  step: number;
};

/** Step lives in the RHF field `step` (0-based) so every caller shares it and form reset rewinds it. */
export const useFormWizard = <T extends FieldValues>(
  steps: WizardStep<T>[],
): FormWizard => {
  const { trigger } = useFormContext<T>();
  const { setValue } = useFormContext<WizardFormInput>();
  const step = useWatch<WizardFormInput>({ name: 'step' });

  const isFirst = step === 0;
  const isLast = step >= steps.length - 1;

  const next = useCallback(async () => {
    const fields = steps[step]?.fields ?? [];
    const isValid =
      fields.length === 0 || (await trigger(fields, { shouldFocus: true }));
    if (isValid) setValue('step', getNextStep(step, steps.length));
    return isValid;
  }, [setValue, step, steps, trigger]);

  const back = useCallback(
    () => setValue('step', getBackStep(step)),
    [setValue, step],
  );

  const onKeyDown = useCallback<KeyboardEventHandler<HTMLFormElement>>(
    (event) => {
      const { tagName, type } = event.target as HTMLInputElement;
      const intercept = shouldInterceptEnter(
        {
          key: event.key,
          isComposing: event.nativeEvent.isComposing,
          tagName,
          inputType: type,
        },
        isLast,
      );
      if (!intercept) return;
      event.preventDefault();
      void next();
    },
    [isLast, next],
  );

  return { step, isFirst, isLast, next, back, onKeyDown };
};
