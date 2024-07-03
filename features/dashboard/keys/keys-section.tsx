import { KEYS_PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import {
  useCsmEarlyAdoptionKeysLimit,
  useCsmStatus,
  useNodeOperatorInfo,
  useNodeOperatorUnbondedKeys,
} from 'shared/hooks';
import { Item } from './item';
import { Row } from './styles';

export const KeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);
  const { data: unbonded } = useNodeOperatorUnbondedKeys(id);
  const { data: eaLimit } = useCsmEarlyAdoptionKeysLimit();
  const { data: status } = useCsmStatus();

  const eaTarget = status?.isPublicRelease ? undefined : eaLimit?.toNumber();

  return (
    <SectionBlock title="Keys" href={KEYS_PATH}>
      {info && (
        <Stack direction="column" gap="sm">
          <Row>
            <Item
              title="Depositable"
              count={info.depositableValidatorsCount}
              tooltip="Keys awaiting the deposit from the Lido protocol"
              variant="secondary"
            />
            <Item
              title="Active"
              count={info.totalDepositedKeys - info.totalExitedKeys}
            />
            <Item
              title="Limit"
              count={
                info.targetLimitMode > 0 ? info.targetLimit : eaTarget ?? '—'
              }
              variant="secondary"
              tooltip={
                info.targetLimitMode === 1
                  ? 'The limit of keys for this Node Operator has been set by the DAO decision'
                  : info.targetLimitMode === 2
                    ? 'The limit of keys for this Node Operator has been set due to the existence of stuck keys'
                    : eaTarget
                      ? 'Early Adoption period implies the limit for the number of keys per a Node Operator to prevent a quick filling of the module by large operators from Day 1'
                      : undefined
              }
            />
            <Item
              title="Exited"
              count={info.totalExitedKeys}
              variant="secondary"
            />
          </Row>
          <Row>
            <Item
              variant="warning"
              title="Unbonded"
              count={unbonded?.toNumber() ?? '...'}
              tooltip="Keys that have insufficient bond"
            />
            <Item
              variant="warning"
              title="Stuck"
              count={info.stuckValidatorsCount}
              tooltip="Keys that have not been exited timely following an exit signal from the protocol"
            />
            <Item variant="secondary" title="Duplicated" count={0} />
            <Item
              variant="secondary"
              title="Invalid"
              count={info.totalAddedKeys - info.totalVettedKeys}
              tooltip="Keys with invalid signature"
            />
          </Row>
        </Stack>
      )}
    </SectionBlock>
  );
};
