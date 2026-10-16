import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { ScoreChip } from 'shared/components';
import { ApplicationStatus } from './types';

type Props = {
  status: ApplicationStatus;
  typeStatus?: OperatorTypeStatus;
};

export const ApplicationStatusChip: FC<Props> = ({ status, typeStatus }) => {
  switch (status) {
    case 'APPROVED':
      return (
        <ScoreChip type={typeStatus === 'CLAIMED' ? 'default' : 'success'}>
          Approved
        </ScoreChip>
      );
    case 'REJECTED':
      return <ScoreChip type="error">Rejected</ScoreChip>;
    case 'REVIEW':
      return <ScoreChip type="pending">Pending</ScoreChip>;
  }
};
