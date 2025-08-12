import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { TypeStatus } from 'features/ics/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useNavigate } from 'shared/navigate';
import { IcsCommentsDto, IcsFormStatus } from '../../shared/types';
import { ScoreChip } from './score-chip';

type StatusHeaderProps = {
  typeStatus: TypeStatus;
  status?: IcsFormStatus;
  comments?: IcsCommentsDto;
};

const getStatus = (
  status: IcsFormStatus | undefined,
  typeStatus: TypeStatus,
) => {
  switch (status) {
    case 'APPROVED':
      return (
        <ScoreChip type={typeStatus === 'CLAIMED' ? 'default' : 'success'}>
          Approved
        </ScoreChip>
      );
    case 'REJECTED':
      return <ScoreChip type="error">Rejected</ScoreChip>;
    case 'REVIEW':
      return <ScoreChip type="pending">Pending</ScoreChip>;
    default:
      return null;
  }
};

const getProofStatus = (typeStatus: TypeStatus) => {
  switch (typeStatus) {
    case 'CLAIMED':
      return <ScoreChip type="default">Claimed</ScoreChip>;
    case 'ISSUED':
      return <ScoreChip type="success">Issued</ScoreChip>;
    default:
      return <ScoreChip type="pending">Pending</ScoreChip>;
  }
};

const useHint = (
  status: IcsFormStatus | undefined,
  typeStatus: TypeStatus,
  comments: IcsCommentsDto | undefined,
) => {
  const n = useNavigate();

  switch (true) {
    case typeStatus === 'CLAIMED':
      return <Text size="xs">You successfully claimed your Operator type</Text>;
    case typeStatus === 'ISSUED':
      return (
        <>
          <Text size="xs">
            Claim your new operator type on the “Claim operator type” tab
          </Text>

          <div>
            <Button size="xs" onClick={() => n(PATH.TYPE_CLAIM)}>
              Go to claim
            </Button>
          </div>
        </>
      );
    case status === 'REJECTED':
      return <Text size="xs">{comments?.reason}</Text>;
    case status === 'REVIEW':
      return (
        <Text size="xs">
          The assessment process typically takes about two weeks. You cannot
          change the application while it is being reviewed
        </Text>
      );
    case status === 'APPROVED':
      return (
        <Text size="xs">
          Please await issuance; this process typically takes up to three weeks
        </Text>
      );
    default:
      return null;
  }
};

// TODO: if claim is not available yet (v1)
export const StatusHeader: FC<StatusHeaderProps> = ({
  status,
  comments,
  typeStatus,
}) => {
  const statusChip = getStatus(status, typeStatus);
  const proofChip = getProofStatus(typeStatus);
  const hint = useHint(status, typeStatus, comments);

  return (
    <Stack direction="column" gap="md">
      {status && (
        <Stack direction="row" justify="space-between" align="center">
          <Text size="lg" weight={700}>
            Application
          </Text>
          {statusChip}
        </Stack>
      )}
      {(!status || status === 'APPROVED') && (
        <Stack direction="row" justify="space-between" align="center">
          <Text size="lg" weight={700}>
            Operator type
          </Text>
          {proofChip}
        </Stack>
      )}
      {hint}
    </Stack>
  );
};
