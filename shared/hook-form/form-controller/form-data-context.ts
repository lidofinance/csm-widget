import { createContext, useContext } from 'react';
import invariant from 'tiny-invariant';

export const FormDataContext = createContext<any | null>(null);
FormDataContext.displayName = 'FormDataContext';

export const useFormData = <T extends object>() => {
  const value = useContext(FormDataContext);
  invariant(value, 'useFormData was used outside the FormDataContext provider');
  return value as T;
};
