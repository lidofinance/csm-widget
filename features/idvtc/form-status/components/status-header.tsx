import { Text } from '@lidofinance/lido-ui';
import {
  DVT_ASSESSED_DATE,
  IdvtcCommentsDto,
  IdvtcFormStatus,
  useIdvtcState,
} from 'features/idvtc/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import {
  ApplicationStatusChip,
  TypeStatusChip,
  TypeStatusHint,
} from 'shared/node-operator/type-status';

type StatusHeaderProps = {
  status?: IdvtcFormStatus;
  comments?: IdvtcCommentsDto;
};

const getApplicationHint = (
  status: IdvtcFormStatus | undefined,
  comments: IdvtcCommentsDto | undefined,
) => {
  switch (status) {
    case 'REJECTED':
      if (comments?.reason) {
        return <Text size="xs">{comments.reason}</Text>;
      }
      return (
        <Text size="xs">
          Your application was rejected by CSM committee.
          {'\n'}If you believe that these address(es) were incorrectly flagged,
          you may submit an appeal on the Lido Research Forum for review by the
          CSM Committee.
        </Text>
      );
    case 'REVIEW':
      return (
        <Text size="xs">
          The application will be assessed after {DVT_ASSESSED_DATE} as of{' '}
          {DVT_ASSESSED_DATE}. You cannot change the application while it is
          being reviewed.
        </Text>
      );
    case 'APPROVED':
      return (
        <Text size="xs">
          Please await issuance; this process typically takes up to three weeks.
        </Text>
      );
    default:
      return null;
  }
};

export const StatusHeader: FC<StatusHeaderProps> = ({ status, comments }) => {
  const { typeStatus, hasOperator } = useIdvtcState();

  const hasTypeStatus = typeStatus !== 'PENDING';
  const hint = hasTypeStatus ? (
    <TypeStatusHint
      program="IDVTC"
      typeStatus={typeStatus}
      hasOperator={hasOperator}
    />
  ) : (
    getApplicationHint(status, comments)
  );

  return (
    <Stack direction="column" gap="md">
      {status && (
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          data-testid="applicationStatus"
        >
          <Text size="lg" weight={700}>
            Application
          </Text>
          <ApplicationStatusChip status={status} typeStatus={typeStatus} />
        </Stack>
      )}
      {(!status || status === 'APPROVED' || hasTypeStatus) && (
        <Stack
          direction="row"
          justify="space-between"
          align="center"
          data-testid="operatorTypeStatus"
        >
          <Text size="lg" weight={700}>
            Operator type
          </Text>
          <TypeStatusChip typeStatus={typeStatus} />
        </Stack>
      )}
      {hint}
    </Stack>
  );
};
