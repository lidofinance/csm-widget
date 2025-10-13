import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import {
  IcsCommentsDto,
  IcsFormStatus,
  IcsScoresDto,
  TOTAL_SCORE_REQUIRED,
  TypeStatus,
} from 'features/ics/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useNavigate } from 'shared/navigate';

import {
  NodeOperatorOwner,
  useDappStatus,
  useNodeOperatorId,
  useOperatorOwner,
} from 'modules/web3';
import { isAddressEqual } from 'viem';
import { calculateScores, isMinScoresReached } from '../utils';
import { ScoreChip } from './score-chip';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';

type StatusHeaderProps = {
  typeStatus: TypeStatus;
  status?: IcsFormStatus;
  comments?: IcsCommentsDto;
  scores?: IcsScoresDto;
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
    case 'OWNER_ISSUED':
      return <ScoreChip type="success">Approved</ScoreChip>;
    default:
      return <ScoreChip type="pending">Pending</ScoreChip>;
  }
};

const useHint = (
  status: IcsFormStatus | undefined,
  typeStatus: TypeStatus,
  comments: IcsCommentsDto | undefined,
  scores: IcsScoresDto | undefined,
  owner: NodeOperatorOwner | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  const n = useNavigate();

  switch (true) {
    case typeStatus === 'CLAIMED':
      return <Text size="xs">You successfully claimed your Operator type</Text>;
    case typeStatus === 'ISSUED' && !!owner:
      return (
        <>
          <Text size="xs">You&apos;re already eligible to claim ICS type</Text>
          <Text size="xs">
            To claim your current address should be set as your Node Operator
            owner.
          </Text>
        </>
      );
    case typeStatus === 'ISSUED' && !nodeOperatorId:
      return (
        <>
          <Text size="xs">
            Create a new Node Operator with ICS operator type
          </Text>

          <div>
            <Button size="xs" onClick={() => n(PATH.CREATE)}>
              Go to create Node Operator
            </Button>
          </div>
        </>
      );
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
    case typeStatus === 'OWNER_ISSUED':
      return (
        <>
          <Text size="xs">
            Node Operator&apos;s owner address is already eligible to claim ICS
            type
          </Text>
          <Text size="xs">
            Connect with your Node Operator&apos;s owner address to claim ICS
            type
          </Text>
        </>
      );
    case status === 'REJECTED':
      if (comments?.reason) {
        return <Text size="xs">{comments?.reason}</Text>;
      }
      if (scores) {
        const isMinReached = isMinScoresReached(scores);
        const totalScore = calculateScores(scores);

        // Check if total score is sufficient but minimum category requirements are not met
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
    case status === 'REVIEW':
      return (
        <Text size="xs">
          The application will not be assessed until November. You cannot change
          the application while it is being reviewed
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

export const StatusHeader: FC<StatusHeaderProps> = ({
  status,
  typeStatus,
  comments,
  scores,
}) => {
  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: owner } = useOperatorOwner(nodeOperatorId);

  const otherOwner =
    owner && address && !isAddressEqual(owner.address, address)
      ? owner
      : undefined;

  const statusChip = getStatus(status, typeStatus);
  const proofChip = getProofStatus(typeStatus);
  const hint = useHint(
    status,
    typeStatus,
    comments,
    scores,
    otherOwner,
    nodeOperatorId,
  );

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
