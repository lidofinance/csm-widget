import { KEYS_PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock } from 'shared/components';
import { useNodeOperatorInfo } from 'shared/hooks';
import { Row, Wrapper } from './styles';
import { Item } from './item';
import { useNodeOperatorUnbondedKeys } from 'shared/hooks/useNodeOperatorUnbondedKeys';

export const KeysSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: info } = useNodeOperatorInfo(id);
  const { data: unbonded } = useNodeOperatorUnbondedKeys(id);

  return (
    <SectionBlock title="Keys" href={KEYS_PATH}>
      {info && (
        <Wrapper>
          <Row>
            <Item title="Depositable" count={info.depositableValidatorsCount} />
            <Item
              title="Active"
              count={
                info.totalAddedKeys -
                info.depositableValidatorsCount -
                info.totalExitedKeys
              }
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
              count={info.depositableValidatorsCount - info.totalVettedKeys}
            />
          </Row>
        </Wrapper>
      )}
    </SectionBlock>
  );
};
