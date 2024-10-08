import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const STEALING_ROUTES: SwitchRoutes = [
  { title: 'Report', path: PATH.STEALING_REPORT },
  { title: 'Cancel', path: PATH.STEALING_CANCEL },
];

export const StealingPageSwitcher = () => <Switch routes={STEALING_ROUTES} />;
