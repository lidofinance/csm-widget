import { MessageBox } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from 'consts';
import { useOperatorCurveId } from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC } from 'react';
import {
  useDisplayOperatorType,
  useOtherOperatorsClaimable,
} from 'shared/hooks';
import { TxAmount } from 'shared/transaction-modal';
import s from './other-operators-claimable.module.css';

const TEST_ID = 'otherOperatorsClaimable';

type ClaimableLineProps = { operator: ModuleNodeOperator; amount: bigint };

const ClaimableLine: FC<ClaimableLineProps> = ({ operator, amount }) => {
  const { data: curve } = useOperatorCurveId(operator);
  const type = useDisplayOperatorType(curve);

  if (!type) return null;

  return (
    <span className={s.line}>
      You have <TxAmount amount={amount} token={TOKENS.steth} /> on your{' '}
      {OPERATOR_TYPE_METADATA[type].short} Node Operator #
      {operator.nodeOperatorId.toString()}
    </span>
  );
};

export const OtherOperatorsClaimable: FC = () => {
  const items = useOtherOperatorsClaimable();

  if (items.length === 0) return null;

  const lines = items.map(({ operator, amount }) => (
    <ClaimableLine
      key={`${operator.module}-${operator.nodeOperatorId}`}
      operator={operator}
      amount={amount}
    />
  ));

  return (
    <div className={s.box}>
      <MessageBox variant="info" icon={false} dataTestId={{ root: TEST_ID }}>
        {lines}
      </MessageBox>
    </div>
  );
};
