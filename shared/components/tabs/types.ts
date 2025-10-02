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
};

export type TabButtonProps = {
  children: ReactNode;
  value: number;
  disabled?: boolean;
  extra?: ReactNode;
};

export type TabsContextValue = {
  value: number;
  onValueChange: (val: number) => void;
};
