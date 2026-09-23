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
import styled from 'styled-components';

// The success description renders as a <p> (lido-ui Text), whose content
// model only allows phrasing content — spans, not divs, keep this valid.
const Box = styled.span`
  display: flex;
  flex-direction: column;
  gap: 12px;

  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid
    color-mix(in srgb, var(--lido-color-primary) 20%, transparent);
  background: color-mix(in srgb, var(--lido-color-primary) 5%, transparent);

  text-align: left;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
`;

const Line = styled.span`
  display: block;
`;

type ClaimableLineProps = { operator: ModuleNodeOperator; amount: bigint };

const ClaimableLine: FC<ClaimableLineProps> = ({ operator, amount }) => {
  const { data: curve } = useOperatorCurveId(operator);
  const type = useDisplayOperatorType(curve);

  if (!type) return null;

  return (
    <Line>
      You have <TxAmount amount={amount} token={TOKENS.steth} /> on your{' '}
      {OPERATOR_TYPE_METADATA[type].short} Node Operator #
      {operator.nodeOperatorId.toString()}
    </Line>
  );
};

export const OtherOperatorsClaimable: FC = () => {
  const items = useOtherOperatorsClaimable();

  if (items.length === 0) return null;

  return (
    <Box data-testid="otherOperatorsClaimable">
      {items.map(({ operator, amount }) => (
        <ClaimableLine
          key={`${operator.module}-${operator.nodeOperatorId}`}
          operator={operator}
          amount={amount}
        />
      ))}
    </Box>
  );
};
