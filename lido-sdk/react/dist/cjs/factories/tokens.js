'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('@lido-sdk/constants');
var useSDK = require('../hooks/useSDK.js');
var useTokenBalance = require('../hooks/useTokenBalance.js');
var useTotalSupply = require('../hooks/useTotalSupply.js');
var useDecimals = require('../hooks/useDecimals.js');
var useAllowance = require('../hooks/useAllowance.js');
var useApprove = require('../hooks/useApprove.js');

const hooksFactory = (getTokenAddress) => {
    return {
        useTokenBalance: (config) => {
            const { chainId } = useSDK.useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useTokenBalance.useTokenBalance(tokenAddress, undefined, config);
        },
        useTotalSupply: (config) => {
            const { chainId } = useSDK.useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useTotalSupply.useTotalSupply(tokenAddress, config);
        },
        useDecimals: (config) => {
            const { chainId } = useSDK.useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useDecimals.useDecimals(tokenAddress, config);
        },
        useAllowance: (spender, config) => {
            const { chainId } = useSDK.useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useAllowance.useAllowance(tokenAddress, spender, undefined, config);
        },
        useApprove: (amount, spender, wrapper) => {
            const { chainId, account } = useSDK.useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return useApprove.useApprove(amount, tokenAddress, spender, account, wrapper);
        },
    };
};
const wsteth = hooksFactory((chainId) => constants.getTokenAddress(chainId, constants.TOKENS.WSTETH));
const useWSTETHBalance = wsteth.useTokenBalance;
const useWSTETHTotalSupply = wsteth.useTotalSupply;
const useWSTETHDecimals = wsteth.useDecimals;
const useWSTETHAllowance = wsteth.useAllowance;
const useWSTETHApprove = wsteth.useApprove;
const steth = hooksFactory((chainId) => constants.getTokenAddress(chainId, constants.TOKENS.STETH));
const useSTETHBalance = steth.useTokenBalance;
const useSTETHTotalSupply = steth.useTotalSupply;
const useSTETHDecimals = steth.useDecimals;
const useSTETHAllowance = steth.useAllowance;
const useSTETHApprove = steth.useApprove;
const ldo = hooksFactory((chainId) => constants.getTokenAddress(chainId, constants.TOKENS.LDO));
const useLDOBalance = ldo.useTokenBalance;
const useLDOTotalSupply = ldo.useTotalSupply;
const useLDODecimals = ldo.useDecimals;
const useLDOAllowance = ldo.useAllowance;
const useLDOApprove = ldo.useApprove;

exports.hooksFactory = hooksFactory;
exports.useLDOAllowance = useLDOAllowance;
exports.useLDOApprove = useLDOApprove;
exports.useLDOBalance = useLDOBalance;
exports.useLDODecimals = useLDODecimals;
exports.useLDOTotalSupply = useLDOTotalSupply;
exports.useSTETHAllowance = useSTETHAllowance;
exports.useSTETHApprove = useSTETHApprove;
exports.useSTETHBalance = useSTETHBalance;
exports.useSTETHDecimals = useSTETHDecimals;
exports.useSTETHTotalSupply = useSTETHTotalSupply;
exports.useWSTETHAllowance = useWSTETHAllowance;
exports.useWSTETHApprove = useWSTETHApprove;
exports.useWSTETHBalance = useWSTETHBalance;
exports.useWSTETHDecimals = useWSTETHDecimals;
exports.useWSTETHTotalSupply = useWSTETHTotalSupply;
