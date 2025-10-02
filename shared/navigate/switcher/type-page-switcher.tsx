import { PATH } from 'consts/urls';
import { CounterIcs } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const TYPE_ROUTES: SwitcherRoutes = [
  {
    title: 'Score system',
    path: PATH.TYPE_ICS_SYSTEM,
    showRules: ['ICS_ENABLED'],
  },
  {
    title: 'Application form',
    path: PATH.TYPE_ICS_APPLY,
    showRules: ['ICS_ENABLED'],
  },
  {
    title: 'Claim',
    path: PATH.TYPE_CLAIM,
    showRules: ['CAN_CLAIM_ICS'],
    suffix: <CounterIcs />,
  },
];

export const TypePageSwitcher = () => <Switcher routes={TYPE_ROUTES} />;
