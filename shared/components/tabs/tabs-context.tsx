import { createContext, useContext } from 'react';
import { TabsContextValue } from './types';

export const TabsContext = createContext<TabsContextValue | undefined>(
  undefined,
);

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabsContext must be used within a Tabs component');
  }
  return context;
};
