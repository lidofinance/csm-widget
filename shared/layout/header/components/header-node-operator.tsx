import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { Button } from 'shared/node-operator';
import { TypeButton } from 'shared/node-operator/type';
import { ButtonGroup } from '../styles';

const HeaderNodeOperator: FC = () => {
  return (
    <NoSSRWrapper>
      <ButtonGroup>
        <TypeButton data-testid="nodeOperatorCurve" />
        <Button data-testid="nodeOperatorHeader" />
      </ButtonGroup>
    </NoSSRWrapper>
  );
};

export default HeaderNodeOperator;
