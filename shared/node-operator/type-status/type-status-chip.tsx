import { IconCheck, IconHourglass, Tag } from '@lidofinance/lido-app-ui';
import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';

type Props = {
  typeStatus: OperatorTypeStatus;
};

const TEST_ID = { root: 'scoreChip' };

export const TypeStatusChip: FC<Props> = ({ typeStatus }) => {
  switch (typeStatus) {
    case 'CLAIMED':
      return (
        <Tag variant="neutral" icon={<IconCheck />} dataTestId={TEST_ID}>
          Claimed
        </Tag>
      );
    case 'PROOF_USED':
    case 'PROOF_USED_ELSEWHERE':
      return (
        <Tag variant="neutral" dataTestId={TEST_ID}>
          Used
        </Tag>
      );
    case 'PENDING':
      return (
        <Tag variant="neutral" icon={<IconHourglass />} dataTestId={TEST_ID}>
          Pending
        </Tag>
      );
    default:
      return (
        <Tag variant="success" icon={<IconCheck />} dataTestId={TEST_ID}>
          Issued
        </Tag>
      );
  }
};
