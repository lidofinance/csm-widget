import { FC } from 'react';

import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { ButtonStyle } from './styles';

export const EaMember: FC = () => {
  const { data: ea } = useCsmEarlyAdoption();
  const nodeOperatorId = useNodeOperatorId();

  const isMember = !nodeOperatorId && !!ea?.proof;

  if (!isMember) return null;

  return <ButtonStyle>Early Adoption</ButtonStyle>;
};
