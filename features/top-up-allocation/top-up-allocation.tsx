import { useWeb3Key } from 'shared/hooks';

import { EnableTopUpAllocationForm } from './enable-top-up-allocation-form';

export const TopUpAllocation = () => {
  const key = useWeb3Key();
  return <EnableTopUpAllocationForm key={key} />;
};
