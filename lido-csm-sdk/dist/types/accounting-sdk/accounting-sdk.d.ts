import { GetContractReturnType, WalletClient } from 'viem';
import { CSAccountingAbi } from '../abi/CSAccounting.js';
import { CSParametersRegistryAbi } from '../abi/CSParametersRegistry.js';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { AmountByKeys, BondAmountByKeysCountProps, BondForNextKeysProps, KeysCountByBondAmountProps } from './types.js';
export declare class AccountingSDK extends CsmSDKModule {
    protected get contract(): GetContractReturnType<typeof CSAccountingAbi, WalletClient>;
    protected get parametersContract(): GetContractReturnType<typeof CSParametersRegistryAbi, WalletClient>;
    getBondAmountByKeysCountETH({ curveId, keysCount, }: BondAmountByKeysCountProps): Promise<bigint>;
    getBondAmountByKeysCountWstETH({ curveId, keysCount, }: BondAmountByKeysCountProps): Promise<bigint>;
    getBondAmountByKeysCountPerToken(props: BondAmountByKeysCountProps): Promise<AmountByKeys>;
    getCurve(curveId: bigint): Promise<{
        intervals: readonly {
            minKeysCount: bigint;
            minBond: bigint;
            trend: bigint;
        }[];
    }>;
    getKeysCountByBondAmount({ amount, curveId, }: KeysCountByBondAmountProps): Promise<bigint>;
    getBondForNextKeysETH({ nodeOperatorId, keysCount, }: BondForNextKeysProps): Promise<bigint>;
    getBondForNextKeysWstETH({ nodeOperatorId, keysCount, }: BondForNextKeysProps): Promise<bigint>;
    getBondForNextKeysPerToken(props: BondForNextKeysProps): Promise<{
        ETH: bigint;
        stETH: bigint;
        wstETH: bigint;
    }>;
    getKeysRemovalFee(curveId: bigint): Promise<bigint>;
}
//# sourceMappingURL=accounting-sdk.d.ts.map