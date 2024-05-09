import { Zero } from '@ethersproject/constants';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { ClaimRewardsFormInputType } from './context/types';
import { TOKENS } from 'consts/tokens';
import { parseEther } from '@ethersproject/units';
import { useWstethBySteth } from 'shared/hooks';

const OneSteth = parseEther('1');

export const ClaimRewardsFormInfo = () => {
  const [token, amount] = useWatch<
    ClaimRewardsFormInputType,
    ['token', 'amount']
  >({
    name: ['token', 'amount'],
  });

  const { data: wsteth, loading: wstethLoadng } = useWstethBySteth(
    (token === TOKENS.WSTETH && amount) || undefined,
  );

  const { data: rateWsteth, initialLoading: rateLoading } =
    useWstethBySteth(OneSteth);

  return (
    <DataTable>
      {token === TOKENS.WSTETH ? (
        <DataTableRow
          title="Rewards address will receive"
          loading={wstethLoadng}
        >
          <FormatToken amount={wsteth ?? Zero} symbol="wstETH" />
        </DataTableRow>
      ) : undefined}
      {token === TOKENS.STETH ? (
        <DataTableRow title="Rewards address will receive">
          <FormatToken amount={amount ?? Zero} symbol="stETH" />
        </DataTableRow>
      ) : undefined}
      {token === TOKENS.ETH ? (
        <DataTableRow title="Rewards address will request">
          <FormatToken amount={amount ?? Zero} symbol="ETH" />
        </DataTableRow>
      ) : undefined}
      {token === TOKENS.WSTETH ? (
        <DataTableRow title="Exchange rate" loading={rateLoading}>
          1 stETH =
          <FormatToken amount={rateWsteth} symbol="wstETH" />
        </DataTableRow>
      ) : undefined}
      {token === TOKENS.ETH ? (
        <DataTableRow title="Exchange rate">1 stETH = 1 ETH</DataTableRow>
      ) : undefined}
    </DataTable>
  );
};
