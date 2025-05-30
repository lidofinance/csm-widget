import { Address, GetContractReturnType, Hex, WalletClient } from 'viem';
import { CSModuleAbi } from '../abi/CSModule.js';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { CsmStatus, CsmVersions } from './types.js';
export declare class ModuleSDK extends CsmSDKModule {
  protected get contract(): GetContractReturnType<
    typeof CSModuleAbi,
    WalletClient
  >;
  getStatus(): Promise<CsmStatus>;
  getVersions(): Promise<CsmVersions>;
  isVersionsSupported(): Promise<boolean>;
  hasRole(address: Address, role: Hex): Promise<boolean>;
  hasReportStealingRole(address: Address): Promise<boolean>;
}
//# sourceMappingURL=module-sdk.d.ts.map
