import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { ApplicationStatusChip } from './application-status-chip';
import { TypeStatusChip } from './type-status-chip';
import { ApplicationStatus } from './types';

type Props = {
  typeStatus: OperatorTypeStatus;
  formStatus: ApplicationStatus | undefined;
};

export const TypeCardChip: FC<Props> = ({ typeStatus, formStatus }) => {
  if (typeStatus !== 'PENDING')
    return <TypeStatusChip typeStatus={typeStatus} />;
  return formStatus ? <ApplicationStatusChip status={formStatus} /> : null;
};
