import { useWeb3Key } from 'shared/hooks';

import { NormalizeQueueForm } from './normalize-queue-form';

export const NormalizeQueue = () => {
  const key = useWeb3Key();
  return <NormalizeQueueForm key={key} />;
};
