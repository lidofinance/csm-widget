import { useWeb3Key } from 'shared/hooks';
import { RemoveKeysForm } from './remove-keys/remove-keys-form';

export const RemoveKeys = () => {
  const key = useWeb3Key();
  return <RemoveKeysForm key={key} />;
};
