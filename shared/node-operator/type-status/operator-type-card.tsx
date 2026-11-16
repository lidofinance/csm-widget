import { Button } from '@lidofinance/lido-app-ui';
import type { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import {
  ApplicationDisplayType,
  getApplicationDisplayState,
} from './application-display-state';
import { StatusCard } from './status-card';
import { TYPE_PROGRAM, TypeProgram } from './consts';
import { getTypeStatusDescription } from './type-status-description';
import { TypeStatusTag } from './type-status-tag';
import type { ApplicationStatus } from './types';

type Props = {
  program: TypeProgram;
  formStatus?: ApplicationStatus;
  typeStatus: OperatorTypeStatus;
  hasOperator: boolean;
};

const getBody = (
  program: TypeProgram,
  type: ApplicationDisplayType,
  typeStatus: OperatorTypeStatus,
  hasOperator: boolean,
) => {
  switch (type) {
    case 'pending':
      return 'Please await issuance; this process typically takes up to three weeks';
    case 'claimed':
      return 'You successfully claimed your Operator type';
    default:
      return getTypeStatusDescription(program, typeStatus, hasOperator);
  }
};

export const OperatorTypeCard: FC<Props> = ({
  program,
  formStatus,
  typeStatus,
  hasOperator,
}) => {
  const { type, cta } = getApplicationDisplayState({
    formStatus,
    typeStatus,
    hasOperator,
  });

  if (!type) return null;

  const { claimPath, createPath } = TYPE_PROGRAM[program];
  const isCreate = cta === 'create';

  return (
    <StatusCard
      title="Operator type"
      tag={<TypeStatusTag typeStatus={typeStatus} />}
      actions={
        type === 'issued' && (
          <Button variant="primary" href={isCreate ? createPath : claimPath}>
            {isCreate ? `Create ${program} operator` : 'Go to claim'}
          </Button>
        )
      }
      dataTestId="operatorTypeStatus"
    >
      {getBody(program, type, typeStatus, hasOperator)}
    </StatusCard>
  );
};
