import { StethAbiFactory, WstethAbiFactory } from '@lido-sdk/contracts';
import { contractHooksFactory, hooksFactory } from '@lido-sdk/react';
import { getTokenAddress } from 'consts/lido-tokens';
import { TOKENS } from 'consts/tokens';

const wsteth = hooksFactory((chainId) =>
  getTokenAddress(chainId, TOKENS.WSTETH),
);
export const useWSTETHBalance = wsteth.useTokenBalance;
export const useWSTETHTotalSupply = wsteth.useTotalSupply;
export const useWSTETHDecimals = wsteth.useDecimals;
export const useWSTETHAllowance = wsteth.useAllowance;
export const useWSTETHApprove = wsteth.useApprove;

const steth = hooksFactory((chainId) => getTokenAddress(chainId, TOKENS.STETH));
export const useSTETHBalance = steth.useTokenBalance;
export const useSTETHTotalSupply = steth.useTotalSupply;
export const useSTETHDecimals = steth.useDecimals;
export const useSTETHAllowance = steth.useAllowance;
export const useSTETHApprove = steth.useApprove;

const wstethContract = contractHooksFactory(WstethAbiFactory, (chainId) =>
  getTokenAddress(chainId, TOKENS.WSTETH),
);
export const useWSTETHContractRPC = wstethContract.useContractRPC;
export const useWSTETHContractWeb3 = wstethContract.useContractWeb3;

const stethContract = contractHooksFactory(StethAbiFactory, (chainId) =>
  getTokenAddress(chainId, TOKENS.STETH),
);
export const useSTETHContractRPC = stethContract.useContractRPC;
export const useSTETHContractWeb3 = stethContract.useContractWeb3;
