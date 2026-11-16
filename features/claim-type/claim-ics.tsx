import { useWeb3Key } from 'shared/hooks';

import { ClaimIcsForm } from './claim-ics-form';

export const ClaimIcs = () => {
  const key = useWeb3Key();
  return <ClaimIcsForm key={key} />;
};
