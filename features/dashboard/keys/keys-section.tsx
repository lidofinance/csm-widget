import { KEYS_PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { useNodeOperatorInfo } from 'shared/hooks';
import { useNodeOperatorUnbondedKeys } from 'shared/hooks/useNodeOperatorUnbondedKeys';
import { Item } from './item';
import { Row } from './styles';

export const KeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);
  const { data: unbonded } = useNodeOperatorUnbondedKeys(id);

  return (
    <SectionBlock title="Keys" href={KEYS_PATH}>
      {info && (
        <Stack direction="column" gap="sm">
          <Row>
            <Item title="Depositable" count={info.depositableValidatorsCount} />
            <Item
              title="Active"
              count={info.totalDepositedKeys - info.totalExitedKeys}
            />
            <Item
              title="Limit"
              count={info.targetLimitMode > 0 ? info.targetLimit : '—'}
            />
            <Item title="Exited" count={info.totalExitedKeys} />
          </Row>
          <Row>
            <Item title="Unbonded" count={unbonded?.toNumber() ?? '...'} />
            <Item title="Stuck" count={info.stuckValidatorsCount} />
            <Item title="Duplicated" count={0} />
            <Item
              title="Invalid"
              count={info.totalAddedKeys - info.totalVettedKeys}
            />
          </Row>
        </Stack>
      )}
    </SectionBlock>
  );
};
