import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import {
  useKeysLimit,
  useNetworkDuplicates,
  useNodeOperatorInfo,
  useNodeOperatorUnbondedKeys,
} from 'shared/hooks';
import { Item } from './item';
import { Row } from './styles';

export const KeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);
  const { data: unbonded } = useNodeOperatorUnbondedKeys(id);
  const { data: duplicates } = useNetworkDuplicates();
  const { data: eaTarget } = useKeysLimit();

  return (
    <SectionBlock
      title="Keys"
      href={PATH.KEYS_VIEW}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink}
    >
      {info && (
        <Stack direction="column" gap="sm">
          <Row>
            <Item
              title="Depositable"
              count={info.depositableValidatorsCount}
              tooltip="Keys awaiting deposit from the Lido protocol"
              variant="secondary"
            />
            <Item
              title="Active"
              count={info.totalDepositedKeys - info.totalWithdrawnKeys}
            />
            <Item
              title="Limit"
              count={
                info.targetLimitMode > 0 ? info.targetLimit : eaTarget || '—'
              }
              variant="secondary"
              tooltip={
                info.targetLimitMode === 1
                  ? 'The limit of keys for this Node Operator has been set by the protocol'
                  : info.targetLimitMode === 2
                    ? 'The limit of keys for this Node Operator has been set due to the existence of stuck keys'
                    : eaTarget
                      ? 'Early Adoption period implies the limit for the number of keys per a Node Operator to prevent a quick filling of the module by large operators from Day 1'
                      : undefined
              }
            />
            <Item
              title="Withdrawn"
              count={info.totalWithdrawnKeys}
              variant="secondary"
              tooltip="Keys that have already exited"
            />
          </Row>
          <Row>
            <Item
              variant="warning"
              title="Unbonded"
              count={unbonded ?? '...'}
              tooltip="Keys not sufficiently covered by current bond amount"
            />
            <Item
              variant="warning"
              title="Stuck"
              count={info.stuckValidatorsCount}
              tooltip="Keys that have not been exited timely following an exit signal from the protocol"
            />
            <Item
              variant="warning"
              title="Duplicated"
              count={duplicates?.length ?? 0}
            />
            <Item
              variant="warning"
              title="Invalid"
              count={
                info.totalAddedKeys -
                info.totalVettedKeys -
                (duplicates?.length ?? 0)
              }
              tooltip="Keys with invalid signature"
            />
          </Row>
        </Stack>
      )}
    </SectionBlock>
  );
};
