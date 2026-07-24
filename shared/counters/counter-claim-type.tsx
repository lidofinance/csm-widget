import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Counter } from 'shared/components';
import { useCanClaimICS, useCanClaimIDVTC } from 'shared/hooks';

type CounterClaimTypeProps = {
  type?: OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;
};

export const CounterClaimType: FC<CounterClaimTypeProps> = ({ type }) => {
  const canClaimIcs = useCanClaimICS();
  const canClaimIdvtc = useCanClaimIDVTC();

  if (type === OPERATOR_TYPE.CSM_IDVTC || (!type && canClaimIdvtc)) {
    return (
      <Counter count={Number(canClaimIdvtc)} type={OPERATOR_TYPE.CSM_IDVTC} />
    );
  }

  if (type === OPERATOR_TYPE.CSM_ICS || (!type && canClaimIcs)) {
    return <Counter count={Number(canClaimIcs)} type={OPERATOR_TYPE.CSM_ICS} />;
  }

  return null;
};
