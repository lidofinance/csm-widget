import { FC } from 'react';
import { NodeOperatorId } from 'types';
import { DescriptorIdWrapperStyle } from './styles';

type DescriptorIdProps = {
  id: NodeOperatorId;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id }) => {
  return (
    <DescriptorIdWrapperStyle>
      Node Operator #<span>{id}</span>
    </DescriptorIdWrapperStyle>
  );
};
