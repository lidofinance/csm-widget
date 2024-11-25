import { PATH } from 'consts/urls';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const STEALING_ROUTES: SwitcherRoutes = [
  { title: 'Report', path: PATH.STEALING_REPORT },
  { title: 'Cancel', path: PATH.STEALING_CANCEL },
];

export const StealingPageSwitcher = () => <Switcher routes={STEALING_ROUTES} />;
