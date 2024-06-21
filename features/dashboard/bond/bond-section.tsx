import { BOND_PATH } from 'consts/urls';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { SectionBlock } from 'shared/components';
import { useNodeOperatorBalance } from 'shared/hooks';
import { Row, Wrapper } from './styles';

export const BondSection: FC = () => {
  const id = useNodeOperatorId();

  const { data: balance } = useNodeOperatorBalance(id);

  return (
    <SectionBlock title="Bond & Rewards" href={BOND_PATH}>
      {balance && (
        <Wrapper>
          <Row>
            <h4>Bond balance</h4>
          </Row>
        </Wrapper>
      )}
    </SectionBlock>
  );
};
