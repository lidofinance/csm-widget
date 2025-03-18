'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var constants = require('@lido-sdk/constants');
var contracts = require('@lido-sdk/contracts');
var react = require('react');
var useSDK = require('../hooks/useSDK.js');

const contractHooksFactory = (factory, getTokenAddress) => {
    const getContract = contracts.createContractGetter(factory);
    return {
        useContractRPC: () => {
            const { chainId, providerRpc } = useSDK.useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return getContract(tokenAddress, providerRpc);
        },
        useContractWeb3: () => {
            const { chainId, providerWeb3 } = useSDK.useSDK();
            const tokenAddress = getTokenAddress(chainId);
            const signer = react.useMemo(() => {
                return providerWeb3 === null || providerWeb3 === void 0 ? void 0 : providerWeb3.getSigner();
            }, [providerWeb3]);
            if (!signer)
                return null;
            return getContract(tokenAddress, signer);
        },
    };
};
const wsteth = contractHooksFactory(contracts.WstethAbiFactory, (chainId) => constants.getTokenAddress(chainId, constants.TOKENS.WSTETH));
const useWSTETHContractRPC = wsteth.useContractRPC;
const useWSTETHContractWeb3 = wsteth.useContractWeb3;
const steth = contractHooksFactory(contracts.StethAbiFactory, (chainId) => constants.getTokenAddress(chainId, constants.TOKENS.STETH));
const useSTETHContractRPC = steth.useContractRPC;
const useSTETHContractWeb3 = steth.useContractWeb3;
const ldo = contractHooksFactory(contracts.LdoAbiFactory, (chainId) => constants.getTokenAddress(chainId, constants.TOKENS.LDO));
const useLDOContractRPC = ldo.useContractRPC;
const useLDOContractWeb3 = ldo.useContractWeb3;
const withdrawalQueue = contractHooksFactory(contracts.WithdrawalQueueAbiFactory, (chainId) => constants.getWithdrawalQueueAddress(chainId));
const useWithdrawalQueueContractRPC = withdrawalQueue.useContractRPC;
const useWithdrawalQueueContractWeb3 = withdrawalQueue.useContractWeb3;

exports.contractHooksFactory = contractHooksFactory;
exports.useLDOContractRPC = useLDOContractRPC;
exports.useLDOContractWeb3 = useLDOContractWeb3;
exports.useSTETHContractRPC = useSTETHContractRPC;
exports.useSTETHContractWeb3 = useSTETHContractWeb3;
exports.useWSTETHContractRPC = useWSTETHContractRPC;
exports.useWSTETHContractWeb3 = useWSTETHContractWeb3;
exports.useWithdrawalQueueContractRPC = useWithdrawalQueueContractRPC;
exports.useWithdrawalQueueContractWeb3 = useWithdrawalQueueContractWeb3;
