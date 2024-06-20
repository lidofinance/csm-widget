import {
  BOND_ADD_PATH,
  BOND_CLAIM_PATH,
  BOND_CLAIM_REWARDS_PATH,
} from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';

const BOND_ROUTES: SwitchRoutes = [
  { title: 'Claim Bond', path: BOND_CLAIM_PATH },
  { title: 'Claim Rewards', path: BOND_CLAIM_REWARDS_PATH },
  { title: 'Add Bond', path: BOND_ADD_PATH },
];

export const BondPageSwitcher = () => <Switch routes={BOND_ROUTES} />;
