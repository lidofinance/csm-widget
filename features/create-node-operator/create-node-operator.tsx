import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { SubmitKeysForm } from './submit-keys-form';

export const CreateNodeOperator = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <SubmitKeysForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
