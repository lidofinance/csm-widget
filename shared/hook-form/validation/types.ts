import type { FieldName, FieldValues } from 'react-hook-form';

export type ValidateFn<T extends FieldValues = FieldValues> = (
  fieldPath: FieldName<T> | FieldName<T>[],
  validator: () => void | Promise<void>,
) => Promise<void>;

export type ValidationLogic<
  TInput extends FieldValues,
  TNetworkData extends object,
> = (
  values: TInput,
  data: TNetworkData,
  validate: ValidateFn<TInput>,
) => Promise<void>;
