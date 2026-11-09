import { DataListRow } from '@lidofinance/lido-app-ui';
import { convertSharesToEth, TOKENS } from '@lidofinance/lido-csm-sdk';
import { ONE_ETH } from 'consts/tokens';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { SubmitAside, SubmitButton } from 'shared/form-page';
import { FormatToken } from 'shared/formatters';
import { AddBondFormInputType, useAddBondFormData } from './context';

const TokenInfoRows: FC = () => {
  const { poolData } = useAddBondFormData(true);
  const [token, bondAmount] = useWatch<
    AddBondFormInputType,
    ['token', 'bondAmount']
  >({ name: ['token', 'bondAmount'] });

  const toSteth = (amount: bigint) =>
    token === TOKENS.wsteth ? convertSharesToEth(amount, poolData) : amount;

  return (
    <>
      <DataListRow
        label="Bond balance to increase"
        value={
          <FormatToken
            amount={toSteth(bondAmount ?? 0n)}
            token={TOKENS.steth}
          />
        }
        dataTestId={{ root: 'balanceWillReceive' }}
      />
      {token !== TOKENS.steth && (
        <DataListRow
          label="Exchange rate"
          value={
            <>
              <FormatToken amount={ONE_ETH} token={token} />
              {' = '}
              <FormatToken amount={toSteth(ONE_ETH)} token={TOKENS.steth} />
            </>
          }
          dataTestId={{ root: 'exchangeRate', value: 'exchangeRateValue' }}
        />
      )}
    </>
  );
};

export const AddBondAside: FC = () => (
  <SubmitAside rows={<TokenInfoRows />}>
    <SubmitButton>Add bond</SubmitButton>
  </SubmitAside>
);
