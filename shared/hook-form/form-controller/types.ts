import { FieldValues } from 'react-hook-form';

export type FromRevalidate = () => Promise<void> | void;

export type FormSubmitOptions = {
  onConfirm?: FromRevalidate;
  onRetry: () => void;
};

export type FormData<T extends object = any> =
  | {
      data: Partial<T>;
      isPending: true;
      revalidate: FromRevalidate;
    }
  | {
      data: T;
      isPending: false;
      revalidate: FromRevalidate;
    };

export type FormSubmitter<F extends FieldValues, C extends object> = (
  form: F,
  data: C,
  options: FormSubmitOptions,
) => Promise<boolean>;

export type FormSubmitterHook<
  F extends FieldValues,
  C extends object,
> = () => FormSubmitter<F, C>;

export type NetworkData<T extends object, P = void> = (props: P) => FormData<T>;
