import {
  DVT_ASSESSED_DATE,
  IdvtcResponseDto,
  useIdvtcState,
} from 'features/idvtc/shared';
import type { OperatorTypeStatus } from 'modules/web3';
import { FC } from 'react';
import { ApplicationStatusCard } from 'shared/node-operator/type-status';

type Props = Pick<IdvtcResponseDto, 'status' | 'comments' | 'createdAt'> & {
  onApplyAgain: () => void;
  onView: () => void;
};

const getBody = (
  status: IdvtcResponseDto['status'],
  reason: IdvtcResponseDto['comments']['reason'],
  typeStatus: OperatorTypeStatus,
) => {
  switch (status) {
    case 'REVIEW':
      return `The application will be assessed after ${DVT_ASSESSED_DATE} as of ${DVT_ASSESSED_DATE}. You cannot change the application while it is being reviewed.`;
    case 'REJECTED':
      return reason ?? 'Your application was rejected by CSM committee';
    case 'APPROVED':
      return typeStatus === 'CLAIMED'
        ? undefined
        : 'Some of the addresses in your application have been identified as belonging to professional Node Operators';
    default:
      return undefined;
  }
};

export const ApplicationCard: FC<Props> = ({
  status,
  comments,
  createdAt,
  onApplyAgain,
  onView,
}) => {
  const { typeStatus } = useIdvtcState();

  return (
    <ApplicationStatusCard
      status={status}
      typeStatus={typeStatus}
      createdAt={createdAt}
      onApplyAgain={onApplyAgain}
      onView={onView}
    >
      {getBody(status, comments.reason, typeStatus)}
    </ApplicationStatusCard>
  );
};
