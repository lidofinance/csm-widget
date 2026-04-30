import { FC } from 'react';
import {
  DescriptorIdWrapperStyle,
  DescriptorNumber,
  DescriptorText,
} from './styles';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

type DescriptorIdProps = {
  id: NodeOperatorId;
  flat?: boolean;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id, flat }) => {
  return (
    <DescriptorIdWrapperStyle data-testid="descriptorId">
      <DescriptorText>Node Operator</DescriptorText> #
      <DescriptorNumber $bold={!flat}>{id.toString()}</DescriptorNumber>
    </DescriptorIdWrapperStyle>
  );
};
