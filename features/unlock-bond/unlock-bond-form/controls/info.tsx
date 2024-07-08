import { TOKENS } from 'consts/tokens';
import { FC } from 'react';
import { Latice, TitledAmount } from 'shared/components';
import { useUnlockBondFormData } from '../context';

export const Info: FC = () => {
  const { lockedBond, loading } = useUnlockBondFormData();
  return (
    <>
      <Latice variant="secondary">
        <TitledAmount
          warning
          title="Locked bond"
          help="Bond may be locked in the case of an MEV stealing event reported by a dedicated committee. This measure ensures that Node Operators are held accountable for any misbehavior or rule violations."
          loading={loading.isLockedBondLoading}
          amount={lockedBond}
          token={TOKENS.ETH}
        />
      </Latice>
    </>
  );
};
