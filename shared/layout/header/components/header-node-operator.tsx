import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { Button } from 'shared/node-operator';

const HeaderNodeOperator: FC = () => {
  return (
    <NoSSRWrapper>
      <Button data-testid="nodeOperatorHeader" />
    </NoSSRWrapper>
  );
};

export default HeaderNodeOperator;
