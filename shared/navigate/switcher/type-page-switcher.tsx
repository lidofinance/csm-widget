import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { CounterClaimType } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const TYPE_ROUTES: SwitcherRoutes = [
  {
    title: 'Parameters',
    path: PATH.TYPE_PARAMETERS,
  },
  {
    title: 'Claim ICS',
    path: PATH.TYPE_ICS_CLAIM,
    showRules: ['CAN_CLAIM_ICS'],
    suffix: <CounterClaimType type={OPERATOR_TYPE.CSM_ICS} />,
  },
  {
    title: 'Claim IDVTC',
    path: PATH.TYPE_DVT_CLAIM,
    showRules: ['CAN_CLAIM_IDVTC'],
    suffix: <CounterClaimType type={OPERATOR_TYPE.CSM_IDVTC} />,
  },
];

export const TypePageSwitcher = () => <Switcher routes={TYPE_ROUTES} />;
