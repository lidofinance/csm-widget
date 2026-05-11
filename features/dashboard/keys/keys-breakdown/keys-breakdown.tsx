import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { isModuleCM } from 'consts';
import { MoreKeysChip } from 'features/group/shared';
import {
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorStakeSummary,
} from 'modules/web3';
import { FC, useMemo } from 'react';
import { Plural, SquaredChip, Stack, StatusComment } from 'shared/components';
import { computeStakeData } from 'utils';
import { KeysItem } from './keys-item';
import { AccordionStyle, Alert, Check } from './styles';
import { useKeysBreakdown } from './use-keys-breakdown';

export const KeysBreakdown: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data } = useKeysBreakdown(nodeOperatorId);
  const { data: stakeSummary } = useOperatorStakeSummary(nodeOperatorId);
  const { data: info } = useOperatorInfo(nodeOperatorId);

  const moreKeys = useMemo(() => {
    const stakeAndKeys =
      stakeSummary && info ? computeStakeData(stakeSummary, info) : undefined;
    return (stakeAndKeys?.potentialAdditionalKeys ?? 0) > 0;
  }, [info, stakeSummary]);

  const hasAnyKey = !!info && info.totalAddedKeys > 0;
  const hasWeight = isModuleCM && stakeSummary && stakeSummary.weight > 0;

  return (
    <AccordionStyle
      data-testid="keysBreakdownBlock"
      summary={
        <Stack center spaceBetween>
          <Text as="h4" size="sm" weight={700}>
            Keys Breakdown
          </Text>
          <Stack>
            {hasWeight && <MoreKeysChip more={moreKeys} empty={!hasAnyKey} />}
            {hasAnyKey && <IssuesChip issues={data?.issuesCount} />}
          </Stack>
        </Stack>
      }
    >
      <Stack direction="column" gap="ms">
        {isModuleCM && !hasWeight ? (
          !!data?.counts.depositable && (
            <KeysItem
              data-testid="keysAddedCount"
              title="Added"
              count={data?.counts.depositable}
              tooltip="Keys uploaded but unable to receive deposits until the CMC sets a non-zero weight for the sub-operator"
            />
          )
        ) : (
          <KeysItem
            data-testid="keysDepositableCount"
            title="Depositable"
            count={data?.counts.depositable}
            tooltip="Keys awaiting deposit from the Lido protocol"
            {...(moreKeys
              ? {
                  type: hasAnyKey ? 'warning' : 'error',
                  ignoreCountZero: true,
                  comment:
                    'Add more keys to get to your full depositable capacity',
                }
              : undefined)}
          />
        )}
        <KeysItem
          data-testid="keysPendingActivationCount"
          title="Pending activation"
          count={data?.counts.activationPending}
          tooltip="Keys that have received deposits from the Lido protocol and are waiting to become active"
        />
        <KeysItem
          data-testid="keysActiveCount"
          title="Active"
          count={data?.counts.active}
          tooltip="Keys that are active on the Beacon Chain"
        />
        <KeysItem
          data-testid="keysExitedCount"
          title="Exited"
          count={data?.counts.exited}
          tooltip="Keys that have exited but have not yet been withdrawn"
        />
        <KeysItem
          data-testid="keysWithdrawnCount"
          title="Withdrawn"
          count={data?.counts.withdrawn}
          tooltip="Keys that have been exited and fully withdrawn"
        />
        {!isModuleCM && (
          <KeysItem
            data-testid="keysWithStrikesCount"
            type="error"
            title="With strikes"
            count={data?.counts.withStrikes}
            tooltip="Keys that reported with bad performance"
            comment={<StatusComment statuses={[KEY_STATUS.WITH_STRIKES]} />}
          />
        )}
        <KeysItem
          data-testid="keysUnbondedCount"
          type="error"
          title="Unbonded"
          count={data?.counts.unbonded}
          tooltip="Keys that are not sufficiently covered by the current bond amount"
          comment={<StatusComment statuses={[KEY_STATUS.UNBONDED]} />}
        />
        <KeysItem
          data-testid="keysExitRequestedCount"
          type="error"
          title="Exit requested"
          count={data?.counts.exitRequested}
          tooltip="Keys for which an exit has been requested"
          comment={<StatusComment statuses={[KEY_STATUS.EXIT_REQUESTED]} />}
        />
        {!isModuleCM && (
          <KeysItem
            data-testid="keysNonQueuedCount"
            type="error"
            title="Non queued"
            count={data?.counts.nonQueued}
            tooltip="Keys not in deposit queue"
            comment={<StatusComment statuses={[KEY_STATUS.NON_QUEUED]} />}
          />
        )}
        <KeysItem
          data-testid="keysDuplicatedCount"
          type="error"
          title="Duplicated"
          count={data?.counts.duplicated}
          tooltip="Keys that have been uploaded more than once"
          comment={<StatusComment statuses={[KEY_STATUS.DUPLICATED]} />}
        />
        <KeysItem
          data-testid="keysInvalidCount"
          type="error"
          title="Invalid"
          count={data?.counts.invalid}
          tooltip="Keys with invalid signatures"
          comment={<StatusComment statuses={[KEY_STATUS.INVALID]} />}
        />
        <KeysItem
          data-testid="keysUncheckedCount"
          type="error"
          title="Unchecked"
          count={data?.counts.unchecked}
          tooltip="Keys that have not yet been checked due to being invalid or duplicated"
          comment={<StatusComment statuses={[KEY_STATUS.UNCHECKED]} />}
        />
      </Stack>
    </AccordionStyle>
  );
};

const IssuesChip: FC<{ issues?: number }> = ({ issues = 0 }) => (
  <SquaredChip variant={issues > 0 ? 'error' : 'success'}>
    {issues > 0 ? (
      <>
        <Alert />
        <Plural value={issues} variants={['issue', 'issues']} showValue />
      </>
    ) : (
      <>
        <Check />
        No issues
      </>
    )}
  </SquaredChip>
);
