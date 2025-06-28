import { PATH } from 'consts/urls';
import { ReactNode } from 'react';
import { ShowRule } from 'shared/hooks';

export type SwitcherRoutes = {
  title: string;
  path: PATH;
  subpaths?: PATH[];
  showRules?: ShowRule[];
  suffix?: ReactNode;
  warning?: boolean;
}[];
