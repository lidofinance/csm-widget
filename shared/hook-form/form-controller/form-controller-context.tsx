import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { type FieldValues } from 'react-hook-form';
import invariant from 'tiny-invariant';
import { FormSubmitter } from './types';

export type FormControllerContextValueType<
  F extends FieldValues = any,
  C extends object = any,
> = {
  formName?: string;
  onSubmit: FormSubmitter<F, C>;
  onReset?: (args: F) => void;
};

export const FormControllerContext =
  createContext<FormControllerContextValueType | null>(null);
FormControllerContext.displayName = 'FormControllerContext';

export const useFormControllerContext = () => {
  const value = useContext(FormControllerContext);
  invariant(value, 'useFormControllerContext was used outside the provider');
  return value;
};

export const FormControllerProvider: FC<
  PropsWithChildren<{
    submitter: FormSubmitter<any, any>;
    formName?: string;
    onReset?: (args: any) => any;
  }>
> = ({ children, submitter, formName, onReset }) => {
  const formController: FormControllerContextValueType = useMemo(
    () => ({
      formName,
      onSubmit: submitter,
      onReset,
    }),
    [formName, onReset, submitter],
  );

  return (
    <FormControllerContext.Provider value={formController}>
      {children}
    </FormControllerContext.Provider>
  );
};
