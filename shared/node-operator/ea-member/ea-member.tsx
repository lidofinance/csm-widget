import { FC } from 'react';

import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { ButtonStyle } from './styles';

export const EaMember: FC = () => {
  const {
    data: { proof },
  } = useCsmEarlyAdoption();
  const nodeOperatorId = useNodeOperatorId();

  const isMember = !nodeOperatorId && !!proof;

  if (!isMember) return null;

  return <ButtonStyle>EA member</ButtonStyle>;
};
