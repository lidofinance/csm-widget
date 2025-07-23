import { OPERATOR_TYPE } from 'consts';
import { FC } from 'react';
import { Counter } from 'shared/components';
import { useCanClaimICS } from 'shared/hooks';

export const CounterIcs: FC = () => {
  const canClaimIcs = useCanClaimICS();
  const count = Number(canClaimIcs);

  return <Counter count={count} type={OPERATOR_TYPE.ICS} />;
};
