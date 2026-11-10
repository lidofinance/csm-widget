import { Button } from '@lidofinance/lido-app-ui';
import {
  DVT_ASSESSED_DATE,
  IdvtcResponseDto,
  useIdvtcState,
} from 'features/idvtc/shared';
import { FC } from 'react';
import {
  ApplicationStatusTag,
  StatusCard,
  formatSentOn,
} from 'shared/node-operator/type-status';

type Props = Pick<IdvtcResponseDto, 'status' | 'comments' | 'createdAt'> & {
  onApplyAgain: () => void;
  onView: () => void;
};

export const ApplicationCard: FC<Props> = ({
  status,
  comments,
  createdAt,
  onApplyAgain,
  onView,
}) => {
  const { typeStatus } = useIdvtcState();
  const canApplyAgain = status === 'REJECTED' && typeStatus === 'PENDING';

  const body = (() => {
    switch (status) {
      case 'REVIEW':
        return `The application will be assessed after ${DVT_ASSESSED_DATE} as of ${DVT_ASSESSED_DATE}. You cannot change the application while it is being reviewed.`;
      case 'REJECTED':
        return (
          comments.reason ?? 'Your application was rejected by CSM committee'
        );
      case 'APPROVED':
        return typeStatus === 'CLAIMED'
          ? undefined
          : 'Some of the addresses in your application have been identified as belonging to professional Node Operators';
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
