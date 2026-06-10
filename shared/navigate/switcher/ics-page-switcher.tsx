import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { CounterClaimType } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const TYPE_ROUTES: SwitcherRoutes = [
  {
    title: 'Score system',
    path: PATH.TYPE_ICS_SYSTEM,
    showRules: ['ICS_APPLY_ENABLED'],
  },
  {
    title: 'Application form',
    path: PATH.TYPE_ICS_APPLY,
    showRules: ['ICS_APPLY_ENABLED'],
  },
  {
    title: 'Parameters',
    path: PATH.TYPE_ICS_PARAMETERS,
  },
  {
    title: 'Claim',
    path: PATH.TYPE_ICS_CLAIM,
    showRules: ['CAN_CLAIM_ICS'],
    suffix: <CounterClaimType type={OPERATOR_TYPE.CSM_ICS} />,
  },
];

export const IcsPageSwitcher = () => <Switcher routes={TYPE_ROUTES} />;
