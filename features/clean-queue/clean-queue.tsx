import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { CleanQueueForm } from './clean-queue-form';

export const CleanQueue = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <CleanQueueForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
