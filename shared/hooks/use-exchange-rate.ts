import {
  convertSharesToEth,
  PerToken,
  StethPoolData,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';
import { ONE_ETH } from 'consts';
import { deployedModules } from 'consts/modules';
import { useStethPoolData } from 'modules/web3';

const toRates = (poolData: StethPoolData): PerToken<bigint> => ({
  [TOKENS.eth]: ONE_ETH,
  [TOKENS.steth]: ONE_ETH,
  [TOKENS.wsteth]: convertSharesToEth(ONE_ETH, poolData),
});

export const useExchangeRate = <TData = PerToken<bigint>>(
  select?: (data: PerToken<bigint>) => TData,
) =>
  // stETH is chain-wide: pin the module so this works before an operator is active
  useStethPoolData((poolData) => {
    const rates = toRates(poolData);
    return select ? select(rates) : (rates as TData);
  }, deployedModules[0]);
