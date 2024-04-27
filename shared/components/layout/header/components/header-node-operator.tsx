import { FC } from 'react';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { Button } from 'shared/node-operator';

const HeaderNodeOperator: FC = () => {
  return (
    <NoSSRWrapper>
      <Button data-testid="nodeOperatorHeader" />
    </NoSSRWrapper>
  );
};

export default HeaderNodeOperator;
