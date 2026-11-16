import { useWeb3Key } from 'shared/hooks';
import { ShareLimitBanner } from '../create-node-operator/share-limit-banner';
import { AddKeysForm } from './add-keys/add-keys-form';

export const AddKeys = () => {
  const key = useWeb3Key();
  return (
    <>
      <ShareLimitBanner />
      <AddKeysForm key={key} />
    </>
  );
};
