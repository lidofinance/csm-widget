import { createContext, useContext } from 'react';
import { TableContextValue } from './type';

export const TableContext = createContext<TableContextValue<any> | null>(null);

export const useTable = <T,>(): TableContextValue<T> => {
  const context = TableContext as React.Context<TableContextValue<T>>;
  const value = useContext(context);
  if (!value) {
    throw new Error('useTableContext must be used within a TableProvider');
  }
  return value;
};
