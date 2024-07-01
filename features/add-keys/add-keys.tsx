import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { AddKeysForm } from './add-keys/add-keys-form';
import { Faq } from 'shared/components';

export const AddKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <AddKeysForm key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
