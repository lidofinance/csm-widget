import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { Button } from 'shared/node-operator';
import { TypeButton } from 'shared/node-operator/type';

const HeaderNodeOperator: FC = () => {
  return (
    <NoSSRWrapper>
      <TypeButton data-testid="nodeOperatorCurve" />
      <Button data-testid="nodeOperatorHeader" />
    </NoSSRWrapper>
  );
};

export default HeaderNodeOperator;
