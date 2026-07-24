import { PATH } from 'consts/urls';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const DELAYED_PENALTY_ROUTES: SwitcherRoutes = [
  { title: 'Report', path: PATH.DELAYED_PENALTY_REPORT },
  { title: 'Cancel', path: PATH.DELAYED_PENALTY_CANCEL },
];

export const DelayedPenaltyPageSwitcher = () => (
  <Switcher routes={DELAYED_PENALTY_ROUTES} />
);
