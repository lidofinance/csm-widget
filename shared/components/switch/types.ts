import { PATH } from 'consts/urls';
import { ReactNode } from 'react';

export type SwitchRoutes = {
  title: string;
  path: PATH;
  showRules?: ShowSiwtchRules[];
  suffix?: ReactNode;
  warning?: boolean;
}[];

export type SwitchProps = {
  routes: SwitchRoutes;
};

export type ShowSiwtchRules = 'HAS_MANAGER' | 'HAS_REWARDS' | 'HAS_LOCKED_BOND';
