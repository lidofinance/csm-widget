import {
  IconCheck,
  IconCross,
  IconHourglass,
  Tag,
} from '@lidofinance/lido-app-ui';
import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { ApplicationStatus } from './types';

type Props = {
  status: ApplicationStatus;
  typeStatus?: OperatorTypeStatus;
};

const TEST_ID = { root: 'scoreChip' };

export const ApplicationStatusTag: FC<Props> = ({ status, typeStatus }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <Tag
          variant={typeStatus === 'CLAIMED' ? 'neutral' : 'success'}
          icon={<IconCheck />}
          dataTestId={TEST_ID}
        >
          Approved
        </Tag>
      );
    case 'REJECTED':
      return (
        <Tag variant="error" icon={<IconCross />} dataTestId={TEST_ID}>
          Rejected
        </Tag>
      );
    case 'REVIEW':
      return (
        <Tag variant="neutral" icon={<IconHourglass />} dataTestId={TEST_ID}>
          Pending
        </Tag>
      );
  }
};
