import { FC } from 'react';
import s from './descriptor-id.module.css';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

type DescriptorIdProps = {
  id: NodeOperatorId;
  flat?: boolean;
};

export const DescriptorId: FC<DescriptorIdProps> = ({ id, flat }) => {
  return (
    <span data-testid="descriptorId">
      Node Operator #
      <span className={s.number} data-bold={!flat || undefined}>
        {id.toString()}
      </span>
    </span>
  );
};
