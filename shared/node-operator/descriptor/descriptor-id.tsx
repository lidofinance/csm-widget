import { FC } from 'react';
import { NodeOperatorId } from 'types';
import { DescriptorIdWrapperStyle } from './styles';

type DescriptorIdProps = {
  id: NodeOperatorId;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id }) => {
  return (
    <DescriptorIdWrapperStyle>
      NO#<span>{id}</span>
    </DescriptorIdWrapperStyle>
  );
};
