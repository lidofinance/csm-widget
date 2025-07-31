import { FC } from 'react';
import {
  DescriptorIdWrapperStyle,
  DescriptorNumber,
  DescriptorText,
} from './styles';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

type DescriptorIdProps = {
  id: NodeOperatorId;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id }) => {
  return (
    <DescriptorIdWrapperStyle data-testid="descriptorId">
      <DescriptorText>Node Operator</DescriptorText> #
      <DescriptorNumber>{id.toString()}</DescriptorNumber>
    </DescriptorIdWrapperStyle>
  );
};
