import { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { ApplicationStatusTag } from './application-status-tag';
import { TypeStatusTag } from './type-status-tag';
import { ApplicationStatus } from './types';

type Props = {
  typeStatus: OperatorTypeStatus;
  formStatus: ApplicationStatus | undefined;
};

export const TypeCardChip: FC<Props> = ({ typeStatus, formStatus }) => {
  if (typeStatus !== 'PENDING')
    return <TypeStatusTag typeStatus={typeStatus} />;
  return formStatus ? <ApplicationStatusTag status={formStatus} /> : null;
};
