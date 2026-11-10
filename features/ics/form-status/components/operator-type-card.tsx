import { Button } from '@lidofinance/lido-app-ui';
import { IcsFormStatus, useIcsState } from 'features/ics/shared';
import { FC } from 'react';
import {
  StatusCard,
  TYPE_PROGRAM,
  TypeStatusTag,
  getApplicationDisplayState,
  getTypeStatusDescription,
} from 'shared/node-operator/type-status';

type Props = {
  status?: IcsFormStatus;
};

const { claimPath, createPath } = TYPE_PROGRAM.ICS;

export const OperatorTypeCard: FC<Props> = ({ status }) => {
  const { typeStatus, hasOperator } = useIcsState();
  const { type, cta } = getApplicationDisplayState({
    formStatus: status,
    typeStatus,
    hasOperator,
  });

  if (!type) return null;

  const isCreate = cta === 'create';

  const body = (() => {
    switch (type) {
      case 'pending':
        return 'Please await issuance; this process typically takes up to three weeks';
      case 'claimed':
        return 'You successfully claimed your Operator type';
      case 'issued':
        return isCreate
          ? 'Create a new Node Operator with ICS operator type'
          : 'Claim your new operator type on the “Claim operator type” tab';
      default:
        return getTypeStatusDescription('ICS', typeStatus, hasOperator);
    }
  })();

  const actions =
    type === 'issued' ? (
      <Button variant="primary" href={isCreate ? createPath : claimPath}>
        {isCreate ? 'Create ICS operator' : 'Go to claim'}
      </Button>
    ) : undefined;

  return (
    <StatusCard
      title="Operator type"
      tag={<TypeStatusTag typeStatus={typeStatus} />}
      actions={actions}
      dataTestId="operatorTypeStatus"
    >
      {body}
    </StatusCard>
  );
};
