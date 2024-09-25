import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { StealingCancelForm } from './stealing-cancel-form';

export const StealingCancel = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <StealingCancelForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
