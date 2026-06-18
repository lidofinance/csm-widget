import { NodeOperatorId, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import {
  DVT_ASSESSED_DATE,
  DvtCommentsDto,
  DvtFormStatus,
  DvtTypeStatus,
} from 'features/dvt/shared';
import {
  NodeOperatorOwner,
  useDappStatus,
  useNodeOperatorId,
  useOperatorOwner,
} from 'modules/web3';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { getOperatorTypeQuery } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { isAddressEqual } from 'viem';
import { ScoreChip } from './score-chip';

type StatusHeaderProps = {
  typeStatus: DvtTypeStatus;
  status?: DvtFormStatus;
  comments?: DvtCommentsDto;
};

const getStatus = (
  status: DvtFormStatus | undefined,
  typeStatus: DvtTypeStatus,
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

const getProofStatus = (typeStatus: DvtTypeStatus) => {
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
  status: DvtFormStatus | undefined,
  typeStatus: DvtTypeStatus,
  comments: DvtCommentsDto | undefined,
  owner: NodeOperatorOwner | undefined,
  nodeOperatorId: NodeOperatorId | undefined,
) => {
  switch (true) {
    case typeStatus === 'CLAIMED':
      return <Text size="xs">You successfully claimed your Operator type</Text>;
    case typeStatus === 'ISSUED' && !!owner:
      return (
        <>
          <Text size="xs">
            You&apos;re already eligible to claim IDVTC type
          </Text>
          <Text size="xs">
            To claim your current address should be set as your Node Operator
            owner.
          </Text>
        </>
      );
    case typeStatus === 'ISSUED' && nodeOperatorId === undefined:
      return (
        <>
          <Text size="xs">
            Create a new Node Operator with IDVTC operator type
          </Text>

          <div>
            <LocalLink
              href={PATH.CREATE}
              query={getOperatorTypeQuery(OPERATOR_TYPE.CSM_IDVTC)}
            >
              <Button size="xs">Go to create Node Operator</Button>
            </LocalLink>
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
            <LocalLink href={PATH.TYPE_DVT_CLAIM}>
              <Button size="xs">Go to claim</Button>
            </LocalLink>
          </div>
        </>
      );
    case typeStatus === 'OWNER_ISSUED':
      return (
        <>
          <Text size="xs">
            Node Operator&apos;s owner address is already eligible to claim
            IDVTC type
          </Text>
          <Text size="xs">
            Connect with your Node Operator&apos;s owner address to claim IDVTC
            type
          </Text>
        </>
      );
    case status === 'REJECTED':
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
    case status === 'REVIEW':
      return (
        <Text size="xs">
          The application will be assessed after {DVT_ASSESSED_DATE} as of{' '}
          {DVT_ASSESSED_DATE}. You cannot change the application while it is
          being reviewed.
        </Text>
      );
    case status === 'APPROVED':
      return (
        <Text size="xs">
          Please await issuance; this process typically takes up to three weeks.
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
