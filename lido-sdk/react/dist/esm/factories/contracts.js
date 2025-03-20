import { getTokenAddress, TOKENS, getWithdrawalQueueAddress } from '@lido-sdk/constants';
import { createContractGetter, WstethAbiFactory, StethAbiFactory, LdoAbiFactory, WithdrawalQueueAbiFactory } from '@lido-sdk/contracts';
import { useMemo } from 'react';
import { useSDK } from '../hooks/useSDK.js';

const contractHooksFactory = (factory, getTokenAddress) => {
    const getContract = createContractGetter(factory);
    return {
        useContractRPC: () => {
            const { chainId, providerRpc } = useSDK();
            const tokenAddress = getTokenAddress(chainId);
            return getContract(tokenAddress, providerRpc);
        },
        useContractWeb3: () => {
            const { chainId, providerWeb3 } = useSDK();
            const tokenAddress = getTokenAddress(chainId);
            const signer = useMemo(() => {
                return providerWeb3 === null || providerWeb3 === void 0 ? void 0 : providerWeb3.getSigner();
            }, [providerWeb3]);
            if (!signer)
                return null;
            return getContract(tokenAddress, signer);
        },
    };
};
const wsteth = contractHooksFactory(WstethAbiFactory, (chainId) => getTokenAddress(chainId, TOKENS.WSTETH));
const useWSTETHContractRPC = wsteth.useContractRPC;
const useWSTETHContractWeb3 = wsteth.useContractWeb3;
const steth = contractHooksFactory(StethAbiFactory, (chainId) => getTokenAddress(chainId, TOKENS.STETH));
const useSTETHContractRPC = steth.useContractRPC;
const useSTETHContractWeb3 = steth.useContractWeb3;
const ldo = contractHooksFactory(LdoAbiFactory, (chainId) => getTokenAddress(chainId, TOKENS.LDO));
const useLDOContractRPC = ldo.useContractRPC;
const useLDOContractWeb3 = ldo.useContractWeb3;
const withdrawalQueue = contractHooksFactory(WithdrawalQueueAbiFactory, (chainId) => getWithdrawalQueueAddress(chainId));
const useWithdrawalQueueContractRPC = withdrawalQueue.useContractRPC;
const useWithdrawalQueueContractWeb3 = withdrawalQueue.useContractWeb3;

export { contractHooksFactory, useLDOContractRPC, useLDOContractWeb3, useSTETHContractRPC, useSTETHContractWeb3, useWSTETHContractRPC, useWSTETHContractWeb3, useWithdrawalQueueContractRPC, useWithdrawalQueueContractWeb3 };
