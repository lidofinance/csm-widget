import { PATH } from 'consts/urls';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const TYPE_ROUTES: SwitcherRoutes = [
  {
    title: 'Score system',
    path: PATH.TYPE_ICS_SYSTEM,
  },
  {
    title: 'Application form',
    path: PATH.TYPE_ICS_APPLY,
  },
];

export const TypePageSwitcher = () => <Switcher routes={TYPE_ROUTES} />;
