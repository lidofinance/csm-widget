import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { UnlockBondForm } from './unlock-bond-form';
import { Faq } from 'shared/components';

export const UnlockBond = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <UnlockBondForm key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
