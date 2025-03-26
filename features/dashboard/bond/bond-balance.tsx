import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { TOKENS } from 'consts/tokens';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Counter } from 'shared/components';
import { useNodeOperatorBalance } from 'shared/hooks';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';

export const BondBalance: FC = () => {
  const id = useNodeOperatorId();

  const { data: bond, initialLoading: isBondLoading } =
    useNodeOperatorBalance(id);

  return (
    <AccordionStyle
      summary={
        <RowHeader>
          <RowTitle>
            Bond balance
            {bond?.isInsufficient && <Counter warning count={1} />}
          </RowTitle>
          <Balance
            big
            loading={isBondLoading}
            amount={bond?.current}
            token={TOKENS.STETH}
          />
        </RowHeader>
      }
    >
      <RowBody>
        <Balance
          title="Required bond"
          loading={isBondLoading}
          amount={bond?.required}
          help="The amount of bond required for all submitted keys of the Node Operator"
        />

        {bond?.isInsufficient ? (
          <>
            <Balance
              warning
              sign="minus"
              title={BOND_INSUFFICIENT}
              loading={isBondLoading}
              amount={bond?.delta}
              help="Insufficient bond is the missing amount of stETH required to cover all operator’s keys"
            />
          </>
        ) : (
          <>
            <Balance
              sign="plus"
              title={BOND_EXCESS}
              loading={isBondLoading}
              amount={bond?.delta}
              help="The bond amount available to claim without having to exit validators. Increases daily"
            />
          </>
        )}
      </RowBody>
    </AccordionStyle>
  );
};
