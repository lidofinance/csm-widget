import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { ClaimBondForm } from './claim-bond-form';
import { Faq } from 'shared/components';

export const ClaimBond = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ClaimBondForm key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
