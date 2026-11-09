import { useNodeOperator } from 'modules/web3';
import { FC } from 'react';
import { NavCounter } from './nav-counter';
import { useMyOperatorsIssues } from 'shared/hooks';
import { isSameOperator } from 'shared/node-operator/utils';

// The dashboard already surfaces the active operator's issues; count only the others.
export const CounterMyOperators: FC = () => {
  const { nodeOperator } = useNodeOperator();
  const withIssues = useMyOperatorsIssues();

  const hasOtherIssues = withIssues.some(
    (op) => !isSameOperator(op, nodeOperator),
  );

  return (
    <NavCounter
      variant="warning"
      count={hasOtherIssues ? 1 : 0}
      testId="myOperatorsCounter"
    />
  );
};
