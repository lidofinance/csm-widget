import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { TransferKeysForm } from './transfer-keys/transfer-keys-form';

export const TransferKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <TransferKeysForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
