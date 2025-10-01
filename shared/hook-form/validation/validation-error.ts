import { values } from 'lodash';
import {
  FieldErrors,
  FieldName,
  FieldValues,
  MultipleFieldErrors,
  ResolverOptions,
} from 'react-hook-form';

export enum DefaultValidationErrorTypes {
  VALIDATE = 'VALIDATE',
  UNHANDLED = 'UNHANDLED',
}

export const isValidationErrorTypeDefault = (type?: string) =>
  (
    [
      DefaultValidationErrorTypes.VALIDATE,
      DefaultValidationErrorTypes.UNHANDLED,
    ] as (string | undefined)[]
  ).includes(type);

export const isValidationErrorTypeValidate = (type?: string) =>
  type === DefaultValidationErrorTypes.VALIDATE;

export const isValidationErrorTypeUnhandled = (type?: string) =>
  type === DefaultValidationErrorTypes.UNHANDLED;

export class ValidationError extends Error {
  field: string;
  type: string;
  payload?: Record<string, unknown>;
  types?: MultipleFieldErrors;
  constructor(
    field: string,
    msg: string,
    type?: string,
    payload?: Record<string, unknown>,
    types?: MultipleFieldErrors,
  ) {
    super(msg);
    this.field = field;
    this.type = type ?? DefaultValidationErrorTypes.VALIDATE;
    this.payload = payload;
    this.types = types;
  }
}

export const initValidator = <T extends FieldValues>(
  options: ResolverOptions<T>,
  fallbackErrorField: FieldName<T>,
) => {
  const errors: FieldErrors<T> = {};

  const validate = async (
    fieldPath: FieldName<T> | FieldName<T>[],
    validator: () => void | Promise<void>,
  ) => {
    if (shouldValidateField(fieldPath, options)) {
      try {
        await validator();
      } catch (error) {
        if (error instanceof ValidationError) {
          if (!errors[error.field]) {
            (errors[error.field] as any) = {
              message: error.message,
              type: error.type,
              types: error.types,
              payload: error.payload,
            };
          }
        } else {
          console.warn(`Unhandled validation error in resolver`, error);
          if (!errors[fallbackErrorField]) {
            (errors[fallbackErrorField] as any) = {
              type: DefaultValidationErrorTypes.UNHANDLED,
              message: 'unknown validation error',
            };
          }
        }
      }
    }
  };

  const resolve = (values: T) => {
    if (hasErrors(errors)) {
      return { values: {}, errors };
    } else {
      return { values, errors: {} };
    }
  };

  return { validate, resolve };
};

export const shouldValidateField = <T extends FieldValues>(
  fieldPath: FieldName<T> | FieldName<T>[],
  options: ResolverOptions<T>,
): boolean => {
  const { names } = options;
  return (
    !names?.length ||
    (Array.isArray(fieldPath)
      ? fieldPath.some((path) => names?.includes(path))
      : names?.includes(fieldPath))
  );
};

export const hasErrors = (errors: Record<string, unknown>) =>
  values(errors).length > 0;

export const handleResolverValidationError = (
  error: unknown,
  formName: string,
  fallbackErrorField: string,
) => {
  if (error instanceof ValidationError) {
    return {
      values: {},
      errors: {
        [error.field]: {
          message: error.message,
          type: error.type,
          payload: error.payload,
        },
      },
    };
  }
  console.warn(`[${formName}] Unhandled validation error in resolver`, error);
  return {
    values: {},
    errors: {
      // for general errors we use 'requests' field
      // cause non-fields get ignored and form is still considerate valid
      [fallbackErrorField]: {
        type: DefaultValidationErrorTypes.UNHANDLED,
        message: 'unknown validation error',
      },
    },
  };
};
