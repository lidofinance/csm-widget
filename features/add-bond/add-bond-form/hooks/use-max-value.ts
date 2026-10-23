import { useMemo } from 'react';
import { config } from 'config';
import { useIsSmartAccount, useMaxGasPrice } from 'modules/web3';
import { useAddBondFormData } from '../context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { getEthMaxBondAmount } from './get-eth-max-bond-amount';
import { useAddBondEthGasLimit } from './use-add-bond-eth-gas-limit';

// smart accounts don't pay gas from their own balance, so nothing is reserved for them
const useEthGasCost = (isEth: boolean) => {
  const { nodeOperatorId } = useAddBondFormData();
  const { isSmartAccount, isLoading: isSmartAccountLoading } =
    useIsSmartAccount();

  const isPadded = isEth && !isSmartAccountLoading && !isSmartAccount;

  const { maxGasPrice, error: gasPriceError } = useMaxGasPrice({
    enabled: isPadded,
  });
  const { data: gasLimit, error: gasLimitError } = useAddBondEthGasLimit(
    nodeOperatorId,
    isPadded,
  );

  const hasError = !!gasPriceError || !!gasLimitError;

  return useMemo(() => {
    if (isSmartAccountLoading) return undefined;
    if (isSmartAccount) return { gasCost: 0n, padding: 0n };
    // estimation fails when the balance can't cover the deposit with gas — padding still applies
    if (hasError) return { gasCost: 0n, padding: config.BALANCE_PADDING };
    if (maxGasPrice === undefined || gasLimit === undefined) return undefined;
    return { gasCost: maxGasPrice * gasLimit, padding: config.BALANCE_PADDING };
  }, [gasLimit, hasError, isSmartAccount, isSmartAccountLoading, maxGasPrice]);
};

export const useMaxValue = (token: TOKENS) => {
  const { ethBalance, stethBalance, wstethBalance, maxStakeEth } =
    useAddBondFormData();
  const ethGasCost = useEthGasCost(token === TOKENS.eth);

  return useMemo(() => {
    switch (token) {
      case TOKENS.eth:
        // undefined hides MAX until the gas cost is known
        return ethGasCost
          ? getEthMaxBondAmount({
              balance: ethBalance ?? 0n,
              gasCost: ethGasCost.gasCost,
              padding: ethGasCost.padding,
              stakeLimit: maxStakeEth,
            })
          : undefined;
      case TOKENS.steth:
        return stethBalance ?? 0n;
      case TOKENS.wsteth:
        return wstethBalance ?? 0n;
    }
  }, [ethBalance, ethGasCost, maxStakeEth, stethBalance, token, wstethBalance]);
};
