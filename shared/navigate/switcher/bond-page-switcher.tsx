import { PATH } from 'consts/urls';
import { CounterLockedBond } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const BOND_ROUTES: SwitcherRoutes = [
  { title: 'Claim', path: PATH.BOND_CLAIM },
  { title: 'Add Bond', path: PATH.BOND_ADD, showRules: ['HAS_ANY_ROLE'] },
  {
    title: 'Rewards history',
    path: PATH.BOND_REWARDS_HISTORY,
    showRules: ['HAS_ANY_ROLE'],
  },
  {
    title: 'Unlock Bond',
    path: PATH.BOND_UNLOCK,
    showRules: [['HAS_LOCKED_BOND', 'HAS_ANY_ROLE']],
    warning: true,
    suffix: <CounterLockedBond />,
  },
];

export const BondPageSwitcher = () => <Switcher routes={BOND_ROUTES} />;
