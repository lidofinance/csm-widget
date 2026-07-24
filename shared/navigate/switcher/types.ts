import { PATH } from 'consts/urls';
import { ReactNode } from 'react';
import { ShowRuleProps } from 'shared/hooks';

type SwitcherRoute = ShowRuleProps & {
  title: string;
  path: PATH;
  subpaths?: PATH[];
  suffix?: ReactNode;
  warning?: boolean;
};

export type SwitcherRoutes = SwitcherRoute[];
