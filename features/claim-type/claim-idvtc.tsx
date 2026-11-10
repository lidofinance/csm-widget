import { useWeb3Key } from 'shared/hooks';

import { ClaimIdvtcForm } from './claim-idvtc-form';

export const ClaimIdvtc = () => {
  const key = useWeb3Key();
  return <ClaimIdvtcForm key={key} />;
};
