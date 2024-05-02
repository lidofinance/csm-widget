import { Zero } from '@ethersproject/constants';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { FormatPrice, FormatToken } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { useClaimBondFormData } from './context/claim-bond-form-context';
import { ClaimBondFormInputType } from './context/types';

export const ClaimBondFormInfo = () => {
  // const token = useWatch<ClaimBondFormInputType, 'token'>({
  //   name: 'token',
  // });

  const gasCost = Zero.add(10); // FIXME: from network
  const { loading } = useClaimBondFormData(); // TODO: gasCost
  const amount = useWatch<ClaimBondFormInputType, 'amount'>({ name: 'amount' });
  const { usdAmount, initialLoading: isEthUsdLoading } = useEthUsd(gasCost);

  return (
    <DataTable>
      <DataTableRow title="Your NO balance will receive">
        <FormatToken amount={amount ?? Zero} symbol="stETH" trimEllipsis />
      </DataTableRow>
      <DataTableRow title="Exchange rate">1 ETH = 1 stETH</DataTableRow>
      <DataTableRow
        title="Max transaction cost"
        loading={loading.isMaxGasPriceLoading || isEthUsdLoading}
      >
        <FormatPrice amount={usdAmount} />
      </DataTableRow>
    </DataTable>
  );
};
