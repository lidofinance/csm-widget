import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import {
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { FC, useCallback } from 'react';
import { SectionBlock, Stack, StatusComment } from 'shared/components';
import { StatusTitle } from 'shared/components/status-chip/status-chip';
import { hasStatus, StatusFilter } from 'utils';
import { Item, ItemAction } from './item';
import { AccordionStyle, Row, RowTitle } from './styles';

const BAD_STATUSES: KEY_STATUS[] = [
  // KEY_STATUS.WITH_STRIKES,
  KEY_STATUS.UNBONDED,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
  KEY_STATUS.EXIT_REQUESTED,
];

export const KeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: info } = useOperatorInfo(id);

  const { data: keys } = useOperatorKeysWithStatus(id);

  const keysCountWithStatus = useCallback(
    (filter: StatusFilter) => keys?.filter(hasStatus(filter)).length,
    [keys],
  );

  const hasWarnings =
    !!keysCountWithStatus(BAD_STATUSES) ||
    !!keysCountWithStatus(KEY_STATUS.WITH_STRIKES);

  const actions = BAD_STATUSES.map((badStatus) =>
    keysCountWithStatus(badStatus) ? (
      <ItemAction
        key={badStatus}
        count={1}
        title={StatusTitle[badStatus]}
        action={<StatusComment statuses={[badStatus]} />}
      />
    ) : null,
  ).filter((v) => !!v);

  const actionsWithStrikes = [
    ...(keysCountWithStatus(KEY_STATUS.WITH_STRIKES)
      ? [
          <ItemAction
            key={KEY_STATUS.WITH_STRIKES}
            count={1}
            title={StatusTitle[KEY_STATUS.WITH_STRIKES]}
            action={<StatusComment statuses={[KEY_STATUS.WITH_STRIKES]} />}
          />,
        ]
      : []),
    ...actions,
  ];

  const limit = info && info.targetLimitMode > 0 ? info.targetLimit : '—';
  const limitTooltip =
    info?.targetLimitMode === 1
      ? 'The limit of keys for this Node Operator has been set by the protocol'
      : info?.targetLimitMode === 2
        ? 'The limit of keys for this Node Operator has been set due to the existence of unbonded keys'
        : undefined;

  return (
    <SectionBlock
      title="Keys"
      data-testid="dashboardKeysSection"
      href={PATH.KEYS_VIEW}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink}
      middle={
        <Stack gap="xxl">
          <Item
            reverse
            title="Total keys"
            count={info?.totalAddedKeys}
            tooltip="Total added keys"
          />
          <Item
            reverse
            title="Keys limit"
            count={limit}
            tooltip={limitTooltip}
          />
        </Stack>
      }
    >
      <Stack direction="column" gap="sm">
        <Row>
          <Item
            data-testid="keysDepositableCount"
            title="Depositable"
            count={keysCountWithStatus(KEY_STATUS.DEPOSITABLE)}
            tooltip="Keys awaiting deposit from the Lido protocol"
          />
          <Item
            data-testid="keysPendingActivationCount"
            title="Pending activation"
            count={keysCountWithStatus(KEY_STATUS.ACTIVATION_PENDING)}
            tooltip="Keys have already got deposit from the Lido protocol and waiting to become active"
          />
          <Item
            data-testid="keysActiveCount"
            title="Active"
            count={keysCountWithStatus([KEY_STATUS.ACTIVE, KEY_STATUS.EXITING])}
            tooltip="Keys that active"
          />
          <Item
            data-testid="keysExitedCount"
            title="Exited"
            count={keysCountWithStatus(KEY_STATUS.WITHDRAWAL_PENDING)}
            tooltip="Keys that have already exited but not withdrawn yet"
          />
          <Item
            data-testid="keysWithdrawnCount"
            title="Withdrawn"
            count={keysCountWithStatus(KEY_STATUS.WITHDRAWN)}
            tooltip="Keys that have already exited and withdrawn"
          />
        </Row>
        {!!keys?.length && (
          <AccordionStyle
            $warning={hasWarnings}
            defaultExpanded={hasWarnings}
            summary={
              hasWarnings ? (
                <RowTitle>
                  Issues with keys found
                  {actions.length > 0 && ', action required'}
                </RowTitle>
              ) : (
                <RowTitle>No issues with keys found</RowTitle>
              )
            }
          >
            <Stack direction="column" gap="md">
              {actionsWithStrikes.length > 0 && (
                <Stack direction="column" gap="sm">
                  {actionsWithStrikes}
                </Stack>
              )}
              <Stack direction="column" gap="md">
                <Row>
                  <Item
                    variant="warning"
                    title="With strikes"
                    count={keysCountWithStatus(KEY_STATUS.WITH_STRIKES)}
                    tooltip="Keys that reported with bad performance"
                  />
                  <Item
                    variant="warning"
                    title="Unbonded"
                    count={keysCountWithStatus(KEY_STATUS.UNBONDED)}
                    tooltip="Keys not sufficiently covered by current bond amount"
                  />
                  <Item
                    variant="warning"
                    title="Exit requested"
                    count={keysCountWithStatus(KEY_STATUS.EXIT_REQUESTED)}
                    tooltip="Keys requested to exit"
                  />
                  <Item
                    variant="warning"
                    title="Non queued"
                    count={keysCountWithStatus(KEY_STATUS.NON_QUEUED)}
                    tooltip="Keys not in deposit queue"
                  />
                </Row>
                <Row>
                  <Item
                    variant="warning"
                    title="Duplicated"
                    count={keysCountWithStatus(KEY_STATUS.DUPLICATED)}
                    tooltip="Keys that uploaded twice"
                  />
                  <Item
                    variant="warning"
                    title="Invalid"
                    count={keysCountWithStatus(KEY_STATUS.INVALID)}
                    tooltip="Keys with invalid signature"
                  />
                  <Item
                    variant="warning"
                    title="Unchecked"
                    count={keysCountWithStatus(KEY_STATUS.UNCHECKED)}
                    tooltip="Keys that not checked yet because invalid or duplicated keys"
                  />
                </Row>
              </Stack>
            </Stack>
          </AccordionStyle>
        )}
      </Stack>
    </SectionBlock>
  );
};
