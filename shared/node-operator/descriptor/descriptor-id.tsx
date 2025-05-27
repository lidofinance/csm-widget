import { FC } from 'react';
import {
  DescriptorIdWrapperStyle,
  DescriptorNumber,
  DescriptorText,
} from './styles';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';

type DescriptorIdProps = {
  id: NodeOperatorId;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id }) => {
  return (
    <DescriptorIdWrapperStyle>
      <DescriptorText>Node Operator</DescriptorText> #
      <DescriptorNumber>{id.toString()}</DescriptorNumber>
    </DescriptorIdWrapperStyle>
  );
};
