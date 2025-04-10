import { FC } from 'react';
import { NodeOperatorId } from 'types';
import {
  DescriptorIdWrapperStyle,
  DescriptorNumber,
  DescriptorText,
} from './styles';

type DescriptorIdProps = {
  id: NodeOperatorId;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id }) => {
  return (
    <DescriptorIdWrapperStyle>
      <DescriptorText>Node Operator</DescriptorText> #
      <DescriptorNumber>{id}</DescriptorNumber>
    </DescriptorIdWrapperStyle>
  );
};
