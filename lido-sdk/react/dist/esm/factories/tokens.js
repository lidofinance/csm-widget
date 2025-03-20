import { getTokenAddress, TOKENS } from '@lido-sdk/constants';
import { useSDK } from '../hooks/useSDK.js';
import { useTokenBalance } from '../hooks/useTokenBalance.js';
import { useTotalSupply } from '../hooks/useTotalSupply.js';
import { useDecimals } from '../hooks/useDecimals.js';
import { useAllowance } from '../hooks/useAllowance.js';
import { useApprove } from '../hooks/useApprove.js';

const hooksFactory = (getTokenAddress) => {
    return {
        useTokenBalance: (config) => {
            const { chainId } = useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useTokenBalance(tokenAddress, undefined, config);
        },
        useTotalSupply: (config) => {
            const { chainId } = useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useTotalSupply(tokenAddress, config);
        },
        useDecimals: (config) => {
            const { chainId } = useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useDecimals(tokenAddress, config);
        },
        useAllowance: (spender, config) => {
            const { chainId } = useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useAllowance(tokenAddress, spender, undefined, config);
        },
        useApprove: (amount, spender, wrapper) => {
            const { chainId, account } = useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useApprove(amount, tokenAddress, spender, account, wrapper);
        },
    };
};
const wsteth = hooksFactory((chainId) => getTokenAddress(chainId, TOKENS.WSTETH));
const useWSTETHBalance = wsteth.useTokenBalance;
const useWSTETHTotalSupply = wsteth.useTotalSupply;
const useWSTETHDecimals = wsteth.useDecimals;
const useWSTETHAllowance = wsteth.useAllowance;
const useWSTETHApprove = wsteth.useApprove;
const steth = hooksFactory((chainId) => getTokenAddress(chainId, TOKENS.STETH));
const useSTETHBalance = steth.useTokenBalance;
const useSTETHTotalSupply = steth.useTotalSupply;
const useSTETHDecimals = steth.useDecimals;
const useSTETHAllowance = steth.useAllowance;
const useSTETHApprove = steth.useApprove;
const ldo = hooksFactory((chainId) => getTokenAddress(chainId, TOKENS.LDO));
const useLDOBalance = ldo.useTokenBalance;
const useLDOTotalSupply = ldo.useTotalSupply;
const useLDODecimals = ldo.useDecimals;
const useLDOAllowance = ldo.useAllowance;
const useLDOApprove = ldo.useApprove;

export { hooksFactory, useLDOAllowance, useLDOApprove, useLDOBalance, useLDODecimals, useLDOTotalSupply, useSTETHAllowance, useSTETHApprove, useSTETHBalance, useSTETHDecimals, useSTETHTotalSupply, useWSTETHAllowance, useWSTETHApprove, useWSTETHBalance, useWSTETHDecimals, useWSTETHTotalSupply };
