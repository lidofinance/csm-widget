import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';
import { EjectKeysForm } from './eject-keys/eject-keys-form';

export const EjectKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <EjectKeysForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
