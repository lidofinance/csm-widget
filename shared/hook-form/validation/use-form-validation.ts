import { useCallback } from 'react';
import type { FieldName, FieldValues, Resolver } from 'react-hook-form';
import { useAwaitFormData } from 'shared/hook-form/form-controller';
import { initValidator } from './validation-error';
import type { ValidationLogic } from './types';

/**
 * Reusable hook for form validation that encapsulates common boilerplate
 *
 * This hook handles:
 * - Awaiting form data from context
 * - Initializing the validator
 * - Running custom validation logic
 * - Resolving the validation result
 *
 * Dependencies (e.g., SDK instances) should be captured via closures.
 * The optional deps parameter is only used for React's dependency tracking.
 *
 * @template TInput - Form input type
 * @template TNetworkData - Network/context data type required for validation
 *
 * @param fallbackField - Field to use for general validation errors
 * @param validationLogic - Function containing the validation rules
 * @param deps - Optional dependencies for React's useCallback (for change tracking only)
 *
 * @returns React Hook Form resolver function
 *
 * @example Without dependencies
 * ```typescript
 * export const useAddBondValidation = () => {
 *   return useFormValidation<AddBondFormInputType, AddBondFormNetworkData>(
 *     'token',
 *     async (values, data, validate) => {
 *       assertRequired(data, 'ethBalance', 'stethBalance');
 *
 *       await validate(['token', 'bondAmount'], () =>
 *         validateBondAmount({
 *           token: values.token,
 *           bondAmount: values.bondAmount,
 *           maxStakeEth: data.maxStakeEth,
 *           ethBalance: data.ethBalance,
 *           stethBalance: data.stethBalance,
 *           wstethBalance: data.wstethBalance,
 *         }),
 *       );
 *     }
 *   );
 * };
 * ```
 *
 * @example With dependencies (captured via closure)
 * ```typescript
 * export const useAddKeysValidation = () => {
 *   const { csm: { depositData: sdk } } = useLidoSDK();
 *
 *   return useFormValidation<AddKeysFormInputType, AddKeysFormNetworkData>(
 *     'token',
 *     async (values, data, validate) => {
 *       // sdk is captured from the closure above
 *       assertRequired(data, 'ethBalance', 'operatorInfo');
 *
 *       await validate('rawDepositData', () => {
 *         const { error } = sdk.parseDepositData(values.rawDepositData);
 *         if (error) throw new ValidationError('rawDepositData', error);
 *       });
 *     },
 *     [sdk] // Track sdk changes for React
 *   );
 * };
 * ```
 */
// TODO: drop fallbackField
export const useFormValidation = <
  TInput extends FieldValues,
  TNetworkData extends object,
>(
  fallbackField: FieldName<TInput>,
  validationLogic: ValidationLogic<TInput, TNetworkData>,
  deps: readonly unknown[] = [],
): Resolver<TInput> => {
  const dataPromise = useAwaitFormData<TNetworkData>();

  return useCallback<Resolver<TInput>>(
    async (values, _, options) => {
      const data = await dataPromise;

      const { validate, resolve } = initValidator(options, fallbackField);

      await validationLogic(values, data, validate);

      return resolve(values);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dataPromise, ...deps],
  );
};
