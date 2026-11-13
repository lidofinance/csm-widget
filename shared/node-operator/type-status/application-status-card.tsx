import { Button } from '@lidofinance/lido-app-ui';
import type { OperatorTypeStatus } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { ApplicationStatusTag } from './application-status-tag';
import { formatSentOn } from './format-sent-on';
import { StatusCard } from './status-card';
import type { ApplicationStatus } from './types';

type Props = {
  status: ApplicationStatus;
  typeStatus: OperatorTypeStatus;
  createdAt: string;
  onApplyAgain: () => void;
  onView: () => void;
  children?: ReactNode;
};

export const ApplicationStatusCard: FC<Props> = ({
  status,
  typeStatus,
  createdAt,
  onApplyAgain,
  onView,
  children,
}) => (
  <StatusCard
    title="Your application"
    subtitle={
      <span data-testid="submittedDate">{formatSentOn(createdAt)}</span>
    }
    tag={<ApplicationStatusTag status={status} typeStatus={typeStatus} />}
    actions={
      <>
        {status === 'REJECTED' && typeStatus === 'PENDING' && (
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
    {children}
  </StatusCard>
);
