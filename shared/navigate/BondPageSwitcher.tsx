import { BOND_ADD_PATH, BOND_CLAIM_PATH, BOND_UNLOCK_PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const BOND_ROUTES: SwitchRoutes = [
  { title: 'Claim', path: BOND_CLAIM_PATH },
  { title: 'Add Bond', path: BOND_ADD_PATH },
  { title: 'Unlock Bond', path: BOND_UNLOCK_PATH },
];

export const BondPageSwitcher = () => <Switch routes={BOND_ROUTES} />;
