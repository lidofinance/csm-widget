import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';
import { FormData } from './types';

export const FormDataContext = createContext<FormData | null>(null);
FormDataContext.displayName = 'FormDataContext';

export const useFormDataContext = <T extends object>(): FormData<T> => {
  const value = useContext(FormDataContext);
  invariant(value, 'useFormData was used outside the FormDataContext provider');
  return value;
};

export function useFormData<T extends object>(onlyLoaded: true): T;
export function useFormData<T extends object>(onlyLoaded?: false): Partial<T>;
// eslint-disable-next-line func-style
export function useFormData<T extends object>(onlyLoaded = false) {
  const value = useFormDataContext<T>();
  if (onlyLoaded && value.isPending) {
    throw new Error('Form data is still pending');
  }
  return value.data;
}

export const useFormDataPending = <T extends object>() => {
  const value = useFormDataContext<T>();
  return value.isPending;
};
