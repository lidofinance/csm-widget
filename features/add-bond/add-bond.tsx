import { useWeb3Key } from 'shared/hooks';

import { AddBondForm } from './add-bond-form';

export const AddBond = () => {
  const key = useWeb3Key();
  return <AddBondForm key={key} />;
};
