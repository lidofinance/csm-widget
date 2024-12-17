import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC, useCallback } from 'react';
import { SectionBlock, Stack, StatusComment } from 'shared/components';
import {
  useKeysLimit,
  useKeysWithStatus,
  useNodeOperatorInfo,
} from 'shared/hooks';
import { KEY_STATUS } from 'types';
import { Item, ItemAction } from './item';
import { AccordionStyle, Row, RowTitle } from './styles';
import { StatusTitle } from 'shared/components/status-chip/status-chip';

const BAD_STATUSES: KEY_STATUS[] = [
  KEY_STATUS.UNBONDED,
  KEY_STATUS.STUCK,
  KEY_STATUS.DUPLICATED,
  KEY_STATUS.INVALID,
  KEY_STATUS.NON_QUEUED,
  KEY_STATUS.UNCHECKED,
  KEY_STATUS.EXIT_REQUESTED,
];

export const KeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);
  const { data: eaTarget } = useKeysLimit();

  const { data: keys } = useKeysWithStatus();

  const keysWithStatus = useCallback(
    (filter: KEY_STATUS | KEY_STATUS[]) =>
      keys?.filter(({ statuses }) =>
        (Array.isArray(filter) ? filter : [filter]).some((st) =>
          statuses.includes(st),
        ),
      ).length,
    [keys],
  );

  const hasWarnings = !!keysWithStatus(BAD_STATUSES);

  const limit =
    info && info.targetLimitMode > 0 ? info.targetLimit : eaTarget || '—';
  const limitTooltip =
    info?.targetLimitMode === 1
      ? 'The limit of keys for this Node Operator has been set by the protocol'
      : info?.targetLimitMode === 2
        ? 'The limit of keys for this Node Operator has been set due to the existence of stuck keys'
        : eaTarget
          ? 'Early Adoption period implies the limit for the number of keys per a Node Operator to prevent a quick filling of the module by large operators from Day 1'
          : undefined;

  return (
    <SectionBlock
      title="Keys"
      href={PATH.KEYS_VIEW}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink}
      middle={
        <Stack gap="xxl">
          <Item
            reverse
            title="Total keys"
            count={27}
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
            title="Depositable"
            count={keysWithStatus(KEY_STATUS.DEPOSITABLE)}
            tooltip="Keys awaiting deposit from the Lido protocol"
          />
          <Item
            title="Pending activation"
            count={keysWithStatus(KEY_STATUS.ACTIVATION_PENDING)}
            tooltip="Keys have already got deposit from the Lido protocol and waiting to become active"
          />
          <Item
            title="Active"
            count={keysWithStatus([KEY_STATUS.ACTIVE, KEY_STATUS.EXITING])}
            tooltip="Keys that active"
          />
          <Item
            title="Exited"
            count={keysWithStatus(KEY_STATUS.WITHDRAWAL_PENDING)}
            tooltip="Keys that have already exited but not withdrawn yet"
          />
          <Item
            title="Withdrawn"
            count={keysWithStatus(KEY_STATUS.WITHDRAWN)}
            tooltip="Keys that have already exited and withdrawn"
          />
        </Row>
        {keys?.length && (
          <AccordionStyle
            $warning={hasWarnings}
            defaultExpanded={hasWarnings}
            summary={
              hasWarnings ? (
                <RowTitle>Issues with keys found, action required</RowTitle>
              ) : (
                <RowTitle>No issues with keys found</RowTitle>
              )
            }
          >
            <Stack direction="column" gap="md">
              {hasWarnings && (
                <Stack direction="column" gap="sm">
                  {BAD_STATUSES.map((badStatus) =>
                    keysWithStatus(badStatus) ? (
                      <ItemAction
                        key={badStatus}
                        count={1}
                        title={StatusTitle[badStatus]}
                        action={<StatusComment statuses={[badStatus]} />}
                      />
                    ) : null,
                  )}
                </Stack>
              )}
              <Stack direction="column" gap="md">
                <Row>
                  <Item
                    variant="warning"
                    title="Unbonded"
                    count={keysWithStatus(KEY_STATUS.UNBONDED)}
                    tooltip="Keys not sufficiently covered by current bond amount"
                  />
                  <Item
                    variant="warning"
                    title="Stuck"
                    count={keysWithStatus(KEY_STATUS.STUCK)}
                    tooltip="Keys that have not been exited timely following an exit signal from the protocol"
                  />
                  <Item
                    variant="warning"
                    title="Exit requested"
                    count={keysWithStatus(KEY_STATUS.EXIT_REQUESTED)}
                    tooltip="Keys requested to exit"
                  />
                  <Item
                    variant="warning"
                    title="Non queued"
                    count={keysWithStatus(KEY_STATUS.NON_QUEUED)}
                    tooltip="Keys not in deposit queue"
                  />
                </Row>
                <Row>
                  <Item
                    variant="warning"
                    title="Duplicated"
                    count={keysWithStatus(KEY_STATUS.DUPLICATED)}
                    tooltip="Keys that uploaded twice"
                  />
                  <Item
                    variant="warning"
                    title="Invalid"
                    count={keysWithStatus(KEY_STATUS.INVALID)}
                    tooltip="Keys with invalid signature"
                  />
                  <Item
                    variant="warning"
                    title="Unchecked"
                    count={keysWithStatus(KEY_STATUS.UNCHECKED)}
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
