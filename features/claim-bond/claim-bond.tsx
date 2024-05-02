import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { ClaimBondForm } from './claim-bond-form';

export const ClaimBond = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ClaimBondForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
