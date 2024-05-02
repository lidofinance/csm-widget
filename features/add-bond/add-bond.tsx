import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { AddBondForm } from './add-bond-form';

export const AddBond = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <AddBondForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
