import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { StealingCancelForm } from './stealing-cancel-form';
import { LockedSection } from './locked-section';

export const StealingCancel = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <StealingCancelForm key={key} />
        <LockedSection key={`${key}_table`} />
      </NoSSRWrapper>
    </>
  );
};
