import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { ScoreChip } from 'shared/components';

type Props = {
  typeStatus: OperatorTypeStatus;
};

export const TypeStatusChip: FC<Props> = ({ typeStatus }) => {
  switch (typeStatus) {
    case 'CLAIMED':
      return <ScoreChip type="default">Claimed</ScoreChip>;
    case 'PROOF_USED':
    case 'PROOF_USED_ELSEWHERE':
      return <ScoreChip type="default">Used</ScoreChip>;
    case 'PENDING':
      return <ScoreChip type="pending">Pending</ScoreChip>;
    default:
      return <ScoreChip type="success">Issued</ScoreChip>;
  }
};
