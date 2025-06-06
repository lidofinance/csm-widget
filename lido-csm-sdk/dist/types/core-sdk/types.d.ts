import { AccountValue, LidoSDKCore, PerformTransactionGasLimit, PerformTransactionSendTransaction, SDKError } from '@lidofinance/lido-ethereum-sdk';
import type { Address, Hash, TransactionReceipt, WaitForTransactionReceiptParameters } from 'viem';
import { CSM_CONTRACT_NAMES, Erc20Tokens } from '../common/index.js';
export type CSM_ADDRESSES = {
    [key2 in CSM_CONTRACT_NAMES | Erc20Tokens]?: Address;
};
export type CsmCoreProps = {
    core: LidoSDKCore;
    overridedAddresses?: CSM_ADDRESSES;
};
export type CommonTransactionProps<TDecodedResult = undefined> = {
    callback?: TransactionCallback<TDecodedResult>;
    account?: AccountValue;
    waitForTransactionReceiptParameters?: WaitForTransactionReceiptParameters;
};
export type PerformTransactionDecodeResult<TDecodedResult> = (receipt: TransactionReceipt) => Promise<TDecodedResult>;
type PerformTransactionOptionsDecodePartial<TDecodedResult> = TDecodedResult extends undefined ? {
    decodeResult?: undefined;
} : {
    decodeResult: PerformTransactionDecodeResult<TDecodedResult>;
};
export type PerformTransactionOptions<TDecodedResult = undefined> = CommonTransactionProps<TDecodedResult> & {
    withPermit?: undefined;
    getGasLimit: PerformTransactionGasLimit;
    sendTransaction: PerformTransactionSendTransaction;
    waitForTransactionReceiptParameters?: WaitForTransactionReceiptParameters;
} & PerformTransactionOptionsDecodePartial<TDecodedResult>;
export declare enum TransactionCallbackStage {
    'PERMIT_SIGN' = "permit_sign",
    'APPROVE_SIGN' = "approve_sign",
    'APPROVE_RECEIPT' = "approve_receipt",
    'GAS_LIMIT' = "gas_limit",
    'SIGN' = "sign",
    'RECEIPT' = "receipt",
    'CONFIRMATION' = "confirmation",
    'DONE' = "done",
    'MULTISIG_DONE' = "multisig_done",
    'ERROR' = "error"
}
export type TransactionCallbackProps<TDecodedResult = undefined> = {
    stage: TransactionCallbackStage.PERMIT_SIGN;
    payload: {
        token: Erc20Tokens;
        amount: bigint;
    };
} | {
    stage: TransactionCallbackStage.APPROVE_SIGN;
    payload: {
        token: Erc20Tokens;
        amount: bigint;
    };
} | {
    stage: TransactionCallbackStage.APPROVE_RECEIPT;
    payload: {
        token: Erc20Tokens;
        amount: bigint;
        hash: Hash;
    };
} | {
    stage: TransactionCallbackStage.GAS_LIMIT;
    payload?: undefined;
} | {
    stage: TransactionCallbackStage.SIGN;
    payload: {
        gas?: bigint;
    };
} | {
    stage: TransactionCallbackStage.RECEIPT;
    payload: {
        hash: Hash;
    };
} | {
    stage: TransactionCallbackStage.CONFIRMATION;
    payload: {
        receipt: TransactionReceipt;
        hash: Hash;
    };
} | {
    stage: TransactionCallbackStage.DONE;
    payload: {
        result: TDecodedResult;
        confirmations: bigint;
        receipt: TransactionReceipt;
        hash: Hash;
    };
} | {
    stage: TransactionCallbackStage.MULTISIG_DONE;
    payload?: undefined;
} | {
    stage: TransactionCallbackStage.ERROR;
    payload: {
        error: SDKError;
    };
};
type TransactionCallbackReturn<TProps> = TProps extends {
    stage: TransactionCallbackStage.SIGN;
} ? bigint | undefined : void;
export type TransactionCallbackResult<TProps> = TransactionCallbackReturn<TProps> | Promise<TransactionCallbackReturn<TProps>>;
export type TransactionCallback<TDecodedResult = undefined> = (props: TransactionCallbackProps<TDecodedResult>) => TransactionCallbackResult<TransactionCallbackProps<TDecodedResult>>;
export type PermitCallbackProps = {
    stage: TransactionCallbackStage.SIGN;
    payload?: undefined;
} | {
    stage: TransactionCallbackStage.DONE;
    payload?: undefined;
} | {
    stage: TransactionCallbackStage.ERROR;
    payload: SDKError;
};
export type PermitCallback = (props: PermitCallbackProps) => void;
export {};
//# sourceMappingURL=types.d.ts.map