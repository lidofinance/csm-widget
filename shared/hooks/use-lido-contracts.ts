import { getTokenAddress, TOKENS } from '@lido-sdk/constants';
import { StethAbiFactory, WstethAbiFactory } from '@lido-sdk/contracts';
import { contractHooksFactory, hooksFactory } from '@lido-sdk/react';

const stethContract = contractHooksFactory(StethAbiFactory, (chainId) =>
  getTokenAddress(chainId, TOKENS.STETH),
);
export const useSTETHContractRPC = stethContract.useContractRPC;

const stethMethods = hooksFactory((chainId) =>
  getTokenAddress(chainId, TOKENS.STETH),
);
export const useSTETHBalance = stethMethods.useTokenBalance;

const wstethContract = contractHooksFactory(WstethAbiFactory, (chainId) =>
  getTokenAddress(chainId, TOKENS.WSTETH),
);
export const useWSTETHContractRPC = wstethContract.useContractRPC;

const wstehMethods = hooksFactory((chainId) =>
  getTokenAddress(chainId, TOKENS.WSTETH),
);
export const useWSTETHBalance = wstehMethods.useTokenBalance;
