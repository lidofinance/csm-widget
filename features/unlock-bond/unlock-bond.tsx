import { useWeb3Key } from 'shared/hooks';

import { UnlockBondForm } from './unlock-bond-form';
import { PenaltyHistory } from './penalty-history';

export const UnlockBond = () => {
  const key = useWeb3Key();
  return (
    <>
      <UnlockBondForm key={key} />
      <PenaltyHistory />
    </>
  );
};
