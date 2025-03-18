import { BaseContract } from '@ethersproject/contracts';
import { CHAINS } from '@lido-sdk/constants';
import { Factory } from '@lido-sdk/contracts';
export declare const contractHooksFactory: <C extends BaseContract>(factory: Factory<C>, getTokenAddress: (chainId: CHAINS) => string) => {
    useContractRPC: () => C;
    useContractWeb3: () => C | null;
};
export declare const useWSTETHContractRPC: () => import("@lido-sdk/contracts").WstethAbi;
export declare const useWSTETHContractWeb3: () => import("@lido-sdk/contracts").WstethAbi | null;
export declare const useSTETHContractRPC: () => import("@lido-sdk/contracts").StethAbi;
export declare const useSTETHContractWeb3: () => import("@lido-sdk/contracts").StethAbi | null;
export declare const useLDOContractRPC: () => import("packages/contracts/dist/esm/generated").LdoAbi;
export declare const useLDOContractWeb3: () => import("packages/contracts/dist/esm/generated").LdoAbi | null;
export declare const useWithdrawalQueueContractRPC: () => import("@lido-sdk/contracts").WithdrawalQueueAbi;
export declare const useWithdrawalQueueContractWeb3: () => import("@lido-sdk/contracts").WithdrawalQueueAbi | null;
