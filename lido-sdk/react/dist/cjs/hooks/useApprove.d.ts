import { ContractTransaction, ContractReceipt } from '@ethersproject/contracts';
import { BigNumber } from '@ethersproject/bignumber';
declare type TransactionCallback = () => Promise<ContractTransaction>;
export declare type UseApproveResponse = {
    approve: () => Promise<void>;
    approving: boolean;
    needsApprove: boolean;
    initialLoading: boolean;
    allowance: BigNumber;
    loading: boolean;
    error: unknown;
};
export declare type UseApproveWrapper = (callback: TransactionCallback) => Promise<ContractReceipt | undefined>;
export declare const useApprove: (amount: BigNumber, token: string, spender: string, owner?: string | undefined, wrapper?: UseApproveWrapper) => UseApproveResponse;
export {};
