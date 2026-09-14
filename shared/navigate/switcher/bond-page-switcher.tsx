import { PATH } from 'consts/urls';
import { CounterLockedBond } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const BOND_ROUTES: SwitcherRoutes = [
  { title: 'Claim', path: PATH.BOND_CLAIM },
  { title: 'Add Bond', path: PATH.BOND_ADD, showRules: ['IS_NODE_OPERATOR'] },
  {
    title: 'Rewards history',
    path: PATH.BOND_REWARDS_HISTORY,
    showRules: ['IS_NODE_OPERATOR'],
  },
  {
    title: 'Unlock Bond',
    path: PATH.BOND_UNLOCK,
    showRules: [['HAS_LOCKED_BOND', 'IS_NODE_OPERATOR']],
    warning: true,
    suffix: <CounterLockedBond />,
  },
];

export const BondPageSwitcher = () => <Switcher routes={BOND_ROUTES} />;
