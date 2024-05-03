import { Zero } from '@ethersproject/constants';
import { parseEther } from '@ethersproject/units';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { useStethByWsteth } from 'shared/hooks';
import { AddBondFormInputType } from './context/types';

const OneWsteth = parseEther('1');

export const AddBondFormInfo = () => {
  const [token, amount] = useWatch<AddBondFormInputType, ['token', 'amount']>({
    name: ['token', 'amount'],
  });

  const { data: wsteth, loading: wstethLoadng } = useStethByWsteth(
    (token === TOKENS.WSTETH && amount) || undefined,
  );

  const { data: rateWsteth, initialLoading: rateLoading } =
    useStethByWsteth(OneWsteth);
  // const { usdAmount, initialLoading: isEthUsdLoading } = useEthUsd(gasCost);

  return (
    <DataTable>
      {token === TOKENS.WSTETH ? (
        <DataTableRow
          title="NO Bond balance will receive"
          loading={wstethLoadng}
        >
          <FormatToken amount={wsteth ?? Zero} symbol="stETH" />
        </DataTableRow>
      ) : (
        <DataTableRow title="NO Bond balance will receive">
          <FormatToken amount={amount ?? Zero} symbol="stETH" trimEllipsis />
        </DataTableRow>
      )}
      {token === TOKENS.WSTETH ? (
        <DataTableRow title="Exchange rate" loading={rateLoading}>
          1 wstETH =
          <FormatToken amount={rateWsteth} symbol="stETH" />
        </DataTableRow>
      ) : undefined}
      {token === TOKENS.ETH ? (
        <DataTableRow title="Exchange rate">1 ETH = 1 stETH</DataTableRow>
      ) : undefined}
    </DataTable>
  );
};
