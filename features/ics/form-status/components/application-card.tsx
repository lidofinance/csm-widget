import { Button, Stack } from '@lidofinance/lido-app-ui';
import {
  ICS_ROUND,
  IcsResponseDto,
  TOTAL_SCORE_REQUIRED,
  useIcsState,
} from 'features/ics/shared';
import { FC } from 'react';
import {
  ApplicationStatusTag,
  StatusCard,
  formatSentOn,
} from 'shared/node-operator/type-status';
import {
  calculateScores,
  hasFlaggedAddresses,
  hasScores,
  isMinScoresReached,
} from '../utils';
import { ApplicationTip } from './application-tip';

type Props = Pick<IcsResponseDto, 'status' | 'comments' | 'scores'> & {
  createdAt: string;
  onApplyAgain: () => void;
  onView: () => void;
};

const getRejectedText = ({
  comments,
  scores,
}: Pick<Props, 'comments' | 'scores'>) => {
  if (comments.reason) return comments.reason;
  if (hasFlaggedAddresses(comments) && !hasScores(scores)) {
    return 'Some of the addresses in your application have been identified as belonging to professional Node Operators';
  }

  const total = calculateScores(scores);
  if (total >= TOTAL_SCORE_REQUIRED && !isMinScoresReached(scores)) {
    return 'Your application did not reach the minimum score required for some categories';
  }
  return `Your application earned ${total} out of the ${TOTAL_SCORE_REQUIRED} points required to qualify`;
};

export const ApplicationCard: FC<Props> = ({
  status,
  comments,
  scores,
  createdAt,
  onApplyAgain,
  onView,
}) => {
  const { typeStatus } = useIcsState();
  const canApplyAgain = status === 'REJECTED' && typeStatus === 'PENDING';

  const body = (() => {
    switch (status) {
      case 'REVIEW':
        return `The application will be evaluated in ${ICS_ROUND.assessedDate}. You cannot change the application while it is being reviewed.`;
      case 'REJECTED':
        return (
          <Stack gap={16}>
            {getRejectedText({ comments, scores })}
            {hasFlaggedAddresses(comments) && !hasScores(scores) && (
              <ApplicationTip />
            )}
          </Stack>
        );
      default:
        return undefined;
    }
  })();

  return (
    <StatusCard
      title="Your application"
      subtitle={
        <span data-testid="submittedDate">{formatSentOn(createdAt)}</span>
      }
      tag={<ApplicationStatusTag status={status} typeStatus={typeStatus} />}
      actions={
        <>
          {canApplyAgain && (
            <Button variant="outline" onClick={onApplyAgain}>
              Apply again
            </Button>
          )}
          <Button
            variant="outline"
            onClick={onView}
            dataTestId={{ root: 'applicationInfo' }}
          >
            View application
          </Button>
        </>
      }
      dataTestId="applicationStatus"
    >
      {body}
    </StatusCard>
  );
};
