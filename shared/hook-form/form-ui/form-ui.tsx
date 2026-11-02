import { createContext, FC, PropsWithChildren, useContext } from 'react';

export type FormUi = 'legacy' | 'app';

const FormUiContext = createContext<FormUi>('legacy');

export const FormUiProvider: FC<PropsWithChildren<{ value: FormUi }>> = ({
  value,
  children,
}) => <FormUiContext.Provider value={value}>{children}</FormUiContext.Provider>;

export const AppFormUi: FC<PropsWithChildren> = ({ children }) => (
  <FormUiProvider value="app">{children}</FormUiProvider>
);

export const useFormUi = (): FormUi => useContext(FormUiContext);
