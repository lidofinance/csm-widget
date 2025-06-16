import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { UnlockBondForm } from './unlock-bond-form';

export const UnlockBond = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <UnlockBondForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
