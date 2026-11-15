import { FC } from 'react';
import { DescriptorNumber } from './styles';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

type DescriptorIdProps = {
  id: NodeOperatorId;
  flat?: boolean;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id, flat }) => {
  return (
    <span data-testid="descriptorId">
      Node Operator #
      <DescriptorNumber $bold={!flat}>{id.toString()}</DescriptorNumber>
    </span>
  );
};
