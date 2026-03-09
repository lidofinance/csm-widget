import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { isModuleCM } from 'consts';
import { FC } from 'react';
import {
  Plural,
  ShortInlineLoader,
  SquaredChip,
  Stack,
  StatusComment,
} from 'shared/components';
import { KeysItem } from './keys-item';
import { AccordionStyle, Alert, Check } from './styles';
import { useKeysBreakdown } from './use-keys-breakdown';

export const KeysBreakdown: FC = () => {
  const { data, isPending } = useKeysBreakdown();

  return (
    <AccordionStyle
      summary={
        <Stack center spaceBetween>
          <Text as="h4" size="sm" weight={700}>
            Keys Breakdown
          </Text>
          <Stack>
            {isPending ? (
              <ShortInlineLoader />
            ) : (data?.issuesCount ?? 0) > 0 ? (
              <SquaredChip variant="error">
                <Alert />
                <Plural
                  value={data?.issuesCount}
                  variants={['issue', 'issues']}
                  showValue
                />
              </SquaredChip>
            ) : (
              <SquaredChip variant="success">
                <Check />
                No issues
              </SquaredChip>
            )}
          </Stack>
        </Stack>
      }
    >
      <Stack direction="column" gap="ms">
        <KeysItem
          data-testid="keysDepositableCount"
          title="Depositable"
          count={data?.counts.depositable}
          tooltip="Keys awaiting deposit from the Lido protocol"
        />
        <KeysItem
          data-testid="keysPendingActivationCount"
          title="Pending activation"
          count={data?.counts.activationPending}
          tooltip="Keys have already got deposit from the Lido protocol and waiting to become active"
        />
        <KeysItem
          data-testid="keysActiveCount"
          type="active"
          title="Active"
          count={data?.counts.active}
          tooltip="Keys that active"
        />
        <KeysItem
          data-testid="keysExitedCount"
          title="Exited"
          count={data?.counts.exited}
          tooltip="Keys that have already exited but not withdrawn yet"
        />
        <KeysItem
          data-testid="keysWithdrawnCount"
          title="Withdrawn"
          count={data?.counts.withdrawn}
          tooltip="Keys that have already exited and withdrawn"
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
          tooltip="Keys not sufficiently covered by current bond amount"
          comment={<StatusComment statuses={[KEY_STATUS.UNBONDED]} />}
        />
        <KeysItem
          data-testid="keysExitRequestedCount"
          type="error"
          title="Exit requested"
          count={data?.counts.exitRequested}
          tooltip="Keys requested to exit"
          comment={<StatusComment statuses={[KEY_STATUS.EXIT_REQUESTED]} />}
        />
        <KeysItem
          data-testid="keysNonQueuedCount"
          type="error"
          title="Non queued"
          count={data?.counts.nonQueued}
          tooltip="Keys not in deposit queue"
          comment={<StatusComment statuses={[KEY_STATUS.NON_QUEUED]} />}
        />
        <KeysItem
          data-testid="keysDuplicatedCount"
          type="error"
          title="Duplicated"
          count={data?.counts.duplicated}
          tooltip="Keys that uploaded twice"
          comment={<StatusComment statuses={[KEY_STATUS.DUPLICATED]} />}
        />
        <KeysItem
          data-testid="keysInvalidCount"
          type="error"
          title="Invalid"
          count={data?.counts.invalid}
          tooltip="Keys with invalid signature"
          comment={<StatusComment statuses={[KEY_STATUS.INVALID]} />}
        />
        <KeysItem
          data-testid="keysUncheckedCount"
          type="error"
          title="Unchecked"
          count={data?.counts.unchecked}
          tooltip="Keys that not checked yet because invalid or duplicated keys"
          comment={<StatusComment statuses={[KEY_STATUS.UNCHECKED]} />}
        />
      </Stack>
    </AccordionStyle>
  );
};
