import { Text } from '@lidofinance/lido-ui';
import {
  DVT_ASSESSED_DATE,
  DvtCommentsDto,
  DvtFormStatus,
} from 'features/dvt/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ScoreChip } from './score-chip';

type StatusHeaderProps = {
  status: DvtFormStatus;
  comments?: DvtCommentsDto;
};

const getStatusChip = (status: DvtFormStatus) => {
  switch (status) {
    case 'APPROVED':
      return <ScoreChip type="success">Approved</ScoreChip>;
    case 'REJECTED':
      return <ScoreChip type="error">Rejected</ScoreChip>;
    case 'REVIEW':
      return <ScoreChip type="pending">Pending</ScoreChip>;
    default:
      return null;
  }
};

const getHint = (status: DvtFormStatus, comments?: DvtCommentsDto) => {
  switch (status) {
    case 'REVIEW':
      return (
        <Text size="xs">
          The application will be assessed after {DVT_ASSESSED_DATE} as of{' '}
          {DVT_ASSESSED_DATE}. You cannot change the application while it is
          being reviewed.
        </Text>
      );
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
  const statusChip = getStatusChip(status);
  const hint = getHint(status, comments);

  return (
    <Stack direction="column" gap="md">
      <Stack direction="row" justify="space-between" align="center">
        <Text size="lg" weight={700}>
          Application
        </Text>
        {statusChip}
      </Stack>
      {hint}
    </Stack>
  );
};
