import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';
import { useNodeOperatorId, useOperatorBalance } from 'modules/web3';
import { FC } from 'react';
import { Counter } from 'shared/components';
import { Balance } from './balance';
import { AccordionStyle, RowBody, RowHeader, RowTitle } from './styles';

export const BondBalance: FC = () => {
  const id = useNodeOperatorId();

  const { data: bond, isPending: isBondLoading } = useOperatorBalance(id);
  const totalBond = (bond?.current ?? 0n) - (bond?.debt ?? 0n);

  return (
    <AccordionStyle
      data-testid="bondBalanceBlock"
      summary={
        <RowHeader>
          <RowTitle>
            Bond balance
            {bond?.isInsufficient && <Counter warning count={1} />}
          </RowTitle>
          <Balance
            data-testid="commonBalance"
            big
            loading={isBondLoading}
            amount={totalBond}
            warning={!!bond?.debt}
            token={TOKENS.steth}
          />
        </RowHeader>
      }
    >
      <RowBody>
        <Balance
          data-testid="requiredBondBalance"
          title="Required bond"
          loading={isBondLoading}
          amount={bond?.required}
          help="The amount of bond required for all submitted keys of the Node Operator"
        />

        {bond?.isInsufficient ? (
          <Balance
            warning
            sign="minus"
            title={BOND_INSUFFICIENT}
            loading={isBondLoading}
            amount={bond?.delta}
            help="Insufficient bond is the missing amount of stETH required to cover all operator’s keys"
          />
        ) : (
          <Balance
            data-testid="excessBondBalance"
            sign="plus"
            title={BOND_EXCESS}
            loading={isBondLoading}
            amount={bond?.delta}
            help="The bond amount available to claim without having to exit validators. Increases daily."
          />
        )}
        {!!bond?.debt && (
          <Balance
            warning
            title="Debt"
            sign="minus"
            loading={isBondLoading}
            amount={bond.debt}
            token={TOKENS.steth}
            help="Outstanding penalty that exceeded your bond balance. Top up your bond to clear it."
          />
        )}
      </RowBody>
    </AccordionStyle>
  );
};
