import { useWeb3Key } from 'shared/hooks';

import { ClaimBondForm } from './claim-bond-form';

export const ClaimBond = () => {
  const key = useWeb3Key();
  return <ClaimBondForm key={key} />;
};
