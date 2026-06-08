import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { ClaimTypeForm } from './claim-type-form';

export const ClaimType = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ClaimTypeForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
