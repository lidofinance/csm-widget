import { useWeb3Key } from 'shared/hooks';
import { AddKeysForm } from './add-keys/add-keys-form';

export const AddKeys = () => {
  const key = useWeb3Key();

  return <AddKeysForm key={key} />;
};
