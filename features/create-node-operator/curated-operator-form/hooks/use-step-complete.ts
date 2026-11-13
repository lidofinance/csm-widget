import { FieldPath, useFormState, useWatch } from 'react-hook-form';
import type { CuratedOperatorFormInputType } from '../context/types';
import { isStepComplete } from '../curated-operator-wizard';

type StepField = FieldPath<CuratedOperatorFormInputType>;

export const useStepComplete = (fields: StepField[]) => {
  const values = useWatch<CuratedOperatorFormInputType>({ name: fields });
  const { errors } = useFormState<CuratedOperatorFormInputType>({
    name: fields,
  });

  return isStepComplete(
    values as unknown[],
    fields.some((field) => !!errors[field]),
  );
};
