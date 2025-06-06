import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { RemoveKeysForm } from './remove-keys/remove-keys-form';
import { Faq } from 'shared/components';

export const RemoveKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <RemoveKeysForm key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
