import { CSM_OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Counter } from 'shared/components';
import { useCanClaimICS } from 'shared/hooks';

export const CounterIcs: FC = () => {
  const canClaimIcs = useCanClaimICS();
  const count = Number(canClaimIcs);

  return <Counter count={count} type={CSM_OPERATOR_TYPE.ICS} />;
};
