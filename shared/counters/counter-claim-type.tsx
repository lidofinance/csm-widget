import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { NavCounter } from './nav-counter';
import { useCanClaimICS, useCanClaimIDVTC } from 'shared/hooks';

type CounterClaimTypeProps = {
  type?: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
};

export const CounterClaimType: FC<CounterClaimTypeProps> = ({ type }) => {
  const canClaimIcs = useCanClaimICS();
  const canClaimIdvtc = useCanClaimIDVTC();

  if (type === OPERATOR_TYPE.CSM_IDVTC || (!type && canClaimIdvtc)) {
    return <NavCounter count={Number(canClaimIdvtc)} variant="action" />;
  }

  if (type === OPERATOR_TYPE.CSM_ICS || (!type && canClaimIcs)) {
    return <NavCounter count={Number(canClaimIcs)} variant="action" />;
  }

  return null;
};
