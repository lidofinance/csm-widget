import { PATH } from 'consts/urls';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const DVT_ROUTES: SwitcherRoutes = [
  {
    title: 'Description',
    path: PATH.TYPE_DVT_DESCRIPTION,
    showRules: ['ICS_APPLY_ENABLED'],
  },
  {
    title: 'Application form',
    path: PATH.TYPE_DVT_APPLY,
    showRules: ['ICS_APPLY_ENABLED'],
  },
];

export const DvtPageSwitcher = () => <Switcher routes={DVT_ROUTES} />;
