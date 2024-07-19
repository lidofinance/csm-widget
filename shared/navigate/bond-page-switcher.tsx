import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const BOND_ROUTES: SwitchRoutes = [
  { title: 'Claim', path: PATH.BOND_CLAIM },
  { title: 'Add Bond', path: PATH.BOND_ADD },
  { title: 'Unlock Bond', path: PATH.BOND_UNLOCK },
];

export const BondPageSwitcher = () => <Switch routes={BOND_ROUTES} />;
