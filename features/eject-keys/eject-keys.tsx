import { useWeb3Key } from 'shared/hooks';
import { EjectKeysForm } from './eject-keys/eject-keys-form';

export const EjectKeys = () => {
  const key = useWeb3Key();
  return <EjectKeysForm key={key} />;
};
