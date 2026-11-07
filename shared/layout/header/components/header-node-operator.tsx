import { FC } from 'react';
import { OperatorTypeButton, SwitchOperatorButton } from 'shared/node-operator';
import { ButtonGroup } from '../styles';

const HeaderNodeOperator: FC = () => {
  return (
    <ButtonGroup>
      <OperatorTypeButton data-testid="nodeOperatorCurve" />
      <SwitchOperatorButton data-testid="nodeOperatorHeader" />
    </ButtonGroup>
  );
};

export default HeaderNodeOperator;
