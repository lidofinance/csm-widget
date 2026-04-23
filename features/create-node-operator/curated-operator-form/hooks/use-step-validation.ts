import { useMemo } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import type { CuratedOperatorFormInputType } from '../context/types';

type StepField = keyof CuratedOperatorFormInputType;

const STEP_FIELDS: Record<number, StepField[]> = {
  1: ['gateIndex'],
  2: ['managerAddress', 'rewardAddress'],
  3: ['name', 'description'],
  4: [],
};

export const useStepValidation = (step: number) => {
  const fields = useMemo(() => STEP_FIELDS[step] ?? [], [step]);
  const values = useWatch<CuratedOperatorFormInputType>({ name: fields });
  const { errors } = useFormState<CuratedOperatorFormInputType>({
    name: fields,
  });

  return useMemo(() => {
    if (fields.length === 0) return true;

    const filled = (values as unknown[]).every(
      (v) => v !== undefined && v !== '',
    );
    const noErrors = fields.every((f) => !errors[f]);

    return filled && noErrors;
  }, [fields, values, errors]);
};
