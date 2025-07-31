import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { NormalizeQueueForm } from './normalize-queue-form';

export const NormalizeQueue = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <NormalizeQueueForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
