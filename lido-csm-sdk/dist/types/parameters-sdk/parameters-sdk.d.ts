import { GetContractReturnType, WalletClient } from 'viem';
import { CSParametersRegistryAbi } from '../abi/CSParametersRegistry.js';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
export declare class ParametersSDK extends CsmSDKModule {
    protected get contract(): GetContractReturnType<typeof CSParametersRegistryAbi, WalletClient>;
    getKeysRemovalFee(curveId: bigint): Promise<bigint>;
    getQueueConfig(curveId: bigint): Promise<{
        priority: number;
        maxDeposits: number;
    }>;
}
//# sourceMappingURL=parameters-sdk.d.ts.map