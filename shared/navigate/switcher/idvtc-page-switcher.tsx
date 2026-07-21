import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { CounterClaimType } from 'shared/counters';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const IDVTC_ROUTES: SwitcherRoutes = [
  {
    title: 'Description',
    path: PATH.TYPE_IDVTC_DESCRIPTION,
    showRules: ['ICS_APPLY_ENABLED'],
  },
  {
    title: 'Application form',
    path: PATH.TYPE_IDVTC_APPLY,
    showRules: ['ICS_APPLY_ENABLED'],
  },
  {
    title: 'Parameters',
    path: PATH.TYPE_IDVTC_PARAMETERS,
  },
  {
    title: 'Claim',
    path: PATH.TYPE_IDVTC_CLAIM,
    showRules: ['CAN_CLAIM_IDVTC'],
    suffix: <CounterClaimType type={OPERATOR_TYPE.CSM_IDVTC} />,
  },
];

export const IdvtcPageSwitcher = () => <Switcher routes={IDVTC_ROUTES} />;
