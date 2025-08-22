import { PATH } from 'consts/urls';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const TYPE_ROUTES: SwitcherRoutes = [
  {
    title: 'Score system',
    path: PATH.TYPE_ICS_SYSTEM,
    showRules: ['ICS_ENABLED'],
  },
  {
    title: 'Application form',
    path: PATH.TYPE_ICS_APPLY,
    showRules: ['ICS_CAN_APPLY'],
  },
];

export const TypePageSwitcher = () => <Switcher routes={TYPE_ROUTES} />;
