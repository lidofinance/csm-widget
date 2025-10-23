import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { OperatorTypeButton, SwitchOperatorButton } from 'shared/node-operator';
import { ButtonGroup } from '../styles';

const HeaderNodeOperator: FC = () => {
  return (
    <NoSSRWrapper>
      <ButtonGroup>
        <OperatorTypeButton data-testid="nodeOperatorCurve" />
        <SwitchOperatorButton data-testid="nodeOperatorHeader" />
      </ButtonGroup>
    </NoSSRWrapper>
  );
};

export default HeaderNodeOperator;
