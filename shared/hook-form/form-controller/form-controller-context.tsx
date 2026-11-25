import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import { type FieldValues } from 'react-hook-form';
import invariant from 'tiny-invariant';
import { type FlowResolver } from './flow';
import { FormSubmitter } from './types';

export type FormControllerContextValueType<
  F extends FieldValues = any,
  C extends object = any,
> = {
  formName?: string;
  onSubmit: FormSubmitter<F, C>;
  resolve?: FlowResolver<F, C, { action: string }>;
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
    resolve?: FlowResolver<any, any, { action: string }>;
    formName?: string;
    onReset?: (args: any) => any;
  }>
> = ({ children, submitter, resolve, formName, onReset }) => {
  const formController: FormControllerContextValueType = useMemo(
    () => ({
      formName,
      onSubmit: submitter,
      resolve,
      onReset,
    }),
    [formName, onReset, resolve, submitter],
  );

  return (
    <FormControllerContext.Provider value={formController}>
      {children}
    </FormControllerContext.Provider>
  );
};
