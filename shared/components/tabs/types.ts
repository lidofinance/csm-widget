import { ReactNode } from 'react';

export type TabItem = {
  title: string;
  extra?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type TabsProps = {
  items: [TabItem, ...TabItem[]];
  defaultTab?: number;
  error?: boolean;
};

export type TabButtonProps = {
  children: ReactNode;
  value: number;
  disabled?: boolean;
  extra?: ReactNode;
  dataTestid?: string;
};

export type TabsContextValue = {
  value: number;
  onValueChange: (val: number) => void;
};
