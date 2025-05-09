import { Config, getFeeHistory } from '@wagmi/core';
import { BigNumber } from 'ethers';

type FeeData = {
  lastBaseFeePerGas: BigNumber;
  maxFeePerGas: BigNumber;
  maxPriorityFeePerGas: BigNumber;
};

export const getFeeData = async (config: Config): Promise<FeeData> => {
  // we look back 5 blocks at fees of botton 25% txs
  // if you want to increase maxPriorityFee output increase percentile
  const feeHistory = await getFeeHistory(config, {
    blockCount: 5,
    rewardPercentiles: [25],
    blockTag: 'latest',
  });

  const lastBaseFeePerGas = BigNumber.from(feeHistory.baseFeePerGas[0]);

  // get average priority fee
  const maxPriorityFeePerGas = feeHistory.reward
    ? feeHistory.reward
        .map((fees) => BigNumber.from(fees[0]))
        .reduce((sum, fee) => sum.add(fee))
        .div(feeHistory.reward.length)
    : lastBaseFeePerGas;

  // we have to multiply by 2 until we find a reliable way to predict baseFee change
  const maxFeePerGas = lastBaseFeePerGas.mul(2).add(maxPriorityFeePerGas);

  return {
    lastBaseFeePerGas,
    maxPriorityFeePerGas,
    maxFeePerGas,
  };
};
