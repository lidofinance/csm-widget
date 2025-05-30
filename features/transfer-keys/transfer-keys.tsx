import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';
import { TransferKeysForm } from './transfer-keys/transfer-keys-form';
import { Faq } from 'shared/components';

export const TransferKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <TransferKeysForm key={key} />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
