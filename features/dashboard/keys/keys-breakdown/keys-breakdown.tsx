import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { isModuleCM } from 'consts';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { FC, useCallback, useMemo } from 'react';
import {
  Plural,
  ShortInlineLoader,
  SquaredChip,
  Stack,
  StatusComment,
} from 'shared/components';
import { hasStatus, StatusFilter } from 'utils/has-status';
import { KeysItem } from './keys-item';
import { AccordionStyle, Alert, Check } from './styles';

const ISSUE_STATUSES: KEY_STATUS[] = [
  KEY_STATUS.WITH_STRIKES,
  KEY_STATUS.UNBONDED,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
  KEY_STATUS.EXIT_REQUESTED,
];

export const KeysBreakdown: FC = () => {
  const id = useNodeOperatorId();
  const { data: keys, isPending } = useOperatorKeysWithStatus(id);

  const keysCountWithStatus = useCallback(
    (filter: StatusFilter) => keys?.filter(hasStatus(filter)).length,
    [keys],
  );

  const keysErrors = useMemo(
    () => ISSUE_STATUSES.filter((status) => keysCountWithStatus(status)).length,
    [keysCountWithStatus],
  );

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
            ) : keysErrors > 0 ? (
              <SquaredChip variant="error">
                <Alert />
                <Plural
                  value={keysErrors}
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
          count={keysCountWithStatus(KEY_STATUS.DEPOSITABLE)}
          tooltip="Keys awaiting deposit from the Lido protocol"
        />
        <KeysItem
          data-testid="keysPendingActivationCount"
          title="Pending activation"
          count={keysCountWithStatus(KEY_STATUS.ACTIVATION_PENDING)}
          tooltip="Keys have already got deposit from the Lido protocol and waiting to become active"
        />
        <KeysItem
          data-testid="keysActiveCount"
          type="active"
          title="Active"
          count={keysCountWithStatus([KEY_STATUS.ACTIVE, KEY_STATUS.EXITING])}
          tooltip="Keys that active"
        />
        <KeysItem
          data-testid="keysExitedCount"
          title="Exited"
          count={keysCountWithStatus(KEY_STATUS.WITHDRAWAL_PENDING)}
          tooltip="Keys that have already exited but not withdrawn yet"
        />
        <KeysItem
          data-testid="keysWithdrawnCount"
          title="Withdrawn"
          count={keysCountWithStatus(KEY_STATUS.WITHDRAWN)}
          tooltip="Keys that have already exited and withdrawn"
        />
        {!isModuleCM && (
          <KeysItem
            data-testid="keysWithStrikesCount"
            type="error"
            title="With strikes"
            count={keysCountWithStatus(KEY_STATUS.WITH_STRIKES)}
            tooltip="Keys that reported with bad performance"
            comment={<StatusComment statuses={[KEY_STATUS.WITH_STRIKES]} />}
          />
        )}
        <KeysItem
          data-testid="keysUnbondedCount"
          type="error"
          title="Unbonded"
          count={keysCountWithStatus(KEY_STATUS.UNBONDED)}
          tooltip="Keys not sufficiently covered by current bond amount"
          comment={<StatusComment statuses={[KEY_STATUS.UNBONDED]} />}
        />
        <KeysItem
          data-testid="keysExitRequestedCount"
          type="error"
          title="Exit requested"
          count={keysCountWithStatus(KEY_STATUS.EXIT_REQUESTED)}
          tooltip="Keys requested to exit"
          comment={<StatusComment statuses={[KEY_STATUS.EXIT_REQUESTED]} />}
        />
        <KeysItem
          data-testid="keysNonQueuedCount"
          type="error"
          title="Non queued"
          count={keysCountWithStatus(KEY_STATUS.NON_QUEUED)}
          tooltip="Keys not in deposit queue"
          comment={<StatusComment statuses={[KEY_STATUS.NON_QUEUED]} />}
        />
        <KeysItem
          data-testid="keysDuplicatedCount"
          type="error"
          title="Duplicated"
          count={keysCountWithStatus(KEY_STATUS.DUPLICATED)}
          tooltip="Keys that uploaded twice"
          comment={<StatusComment statuses={[KEY_STATUS.DUPLICATED]} />}
        />
        <KeysItem
          data-testid="keysInvalidCount"
          type="error"
          title="Invalid"
          count={keysCountWithStatus(KEY_STATUS.INVALID)}
          tooltip="Keys with invalid signature"
          comment={<StatusComment statuses={[KEY_STATUS.INVALID]} />}
        />
        <KeysItem
          data-testid="keysUncheckedCount"
          type="error"
          title="Unchecked"
          count={keysCountWithStatus(KEY_STATUS.UNCHECKED)}
          tooltip="Keys that not checked yet because invalid or duplicated keys"
          comment={<StatusComment statuses={[KEY_STATUS.UNCHECKED]} />}
        />
      </Stack>
    </AccordionStyle>
  );
};
