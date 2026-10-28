import { Text } from '@lidofinance/lido-ui';
import {
  ICS_ROUND,
  IcsCommentsDto,
  IcsFormStatus,
  IcsScoresDto,
  TOTAL_SCORE_REQUIRED,
  useIcsState,
} from 'features/ics/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import {
  ApplicationStatusChip,
  TypeStatusChip,
  TypeStatusHint,
} from 'shared/node-operator/type-status';
import { calculateScores, isMinScoresReached } from '../utils';

type StatusHeaderProps = {
  status?: IcsFormStatus;
  comments?: IcsCommentsDto;
  scores?: IcsScoresDto;
};

const getApplicationHint = (
  status: IcsFormStatus | undefined,
  comments: IcsCommentsDto | undefined,
  scores: IcsScoresDto | undefined,
) => {
  switch (status) {
    case 'REJECTED':
      if (comments?.reason) {
        return <Text size="xs">{comments?.reason}</Text>;
      }
      if (scores) {
        const isMinReached = isMinScoresReached(scores);
        const totalScore = calculateScores(scores);

        if (totalScore >= TOTAL_SCORE_REQUIRED && !isMinReached) {
          return (
            <Text size="xs">
              Your application did not reach the minimum score required for some
              categories
            </Text>
          );
        }

        return (
          <Text size="xs">
            Your application earned {totalScore} out of the{' '}
            {TOTAL_SCORE_REQUIRED} points required to qualify
          </Text>
        );
      }
      return null;
    case 'REVIEW':
      return (
        <Text size="xs">
          The application will be evaluated in {ICS_ROUND.assessedDate}. You
          cannot change the application while it is being reviewed.
        </Text>
      );
    case 'APPROVED':
      return (
        <Text size="xs">
          Please await issuance; this process typically takes up to three weeks
        </Text>
      );
    default:
      return null;
  }
};

export const StatusHeader: FC<StatusHeaderProps> = ({
  status,
  comments,
  scores,
}) => {
  const { typeStatus, hasOperator } = useIcsState();

  const hasTypeStatus = typeStatus !== 'PENDING';
  const hint = hasTypeStatus ? (
    <TypeStatusHint
      program="ICS"
      typeStatus={typeStatus}
      hasOperator={hasOperator}
    />
  ) : (
    getApplicationHint(status, comments, scores)
  );

  return (
    <Stack direction="column" gap="md">
      {status && (
        <Stack direction="row" justify="space-between" align="center">
          <Text size="lg" weight={700}>
            Application
          </Text>
          <ApplicationStatusChip status={status} typeStatus={typeStatus} />
        </Stack>
      )}
      {(!status || status === 'APPROVED' || hasTypeStatus) && (
        <Stack direction="row" justify="space-between" align="center">
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
