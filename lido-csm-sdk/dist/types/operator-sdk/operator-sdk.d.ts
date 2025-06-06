import { GetContractReturnType, WalletClient } from 'viem';
import { CSAccountingAbi } from '../abi/CSAccounting.js';
import { CSModuleAbi } from '../abi/CSModule.js';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { BondBalance, NodeOperatorId } from '../common/index.js';
import { NodeOperatorInfo } from './types.js';
import { ParametersSDK } from '../parameters-sdk/parameters-sdk.js';
export declare class OperatorSDK extends CsmSDKModule<{
    parameters: ParametersSDK;
}> {
    protected get accountingContract(): GetContractReturnType<typeof CSAccountingAbi, WalletClient>;
    protected get moduleContract(): GetContractReturnType<typeof CSModuleAbi, WalletClient>;
    getCurveId(id: NodeOperatorId): Promise<bigint>;
    getBondBalance(id: NodeOperatorId): Promise<BondBalance>;
    getInfo(id: NodeOperatorId): Promise<NodeOperatorInfo>;
    getKeys(id: NodeOperatorId, start?: bigint): Promise<`0x${string}`[]>;
    getKeysCountToMigrate(id: NodeOperatorId): Promise<number>;
}
//# sourceMappingURL=operator-sdk.d.ts.map