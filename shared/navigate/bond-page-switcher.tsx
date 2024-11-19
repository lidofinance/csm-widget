import { PATH } from 'consts/urls';
import { Switch } from 'shared/components';
import { SwitchRoutes } from 'shared/components/switch/types';
import { CounterLockedBond } from 'shared/counters';

const BOND_ROUTES: SwitchRoutes = [
  { title: 'Claim', path: PATH.BOND_CLAIM },
  { title: 'Add Bond', path: PATH.BOND_ADD },
  {
    title: 'Unlock Bond',
    path: PATH.BOND_UNLOCK,
    showRules: ['HAS_LOCKED_BOND'],
    warning: true,
    suffix: <CounterLockedBond />,
  },
];

export const BondPageSwitcher = () => <Switch routes={BOND_ROUTES} />;
