import { Address, GetContractReturnType, WalletClient } from 'viem';
import { CSModuleAbi } from '../abi/CSModule.js';
import { CSModulev1EventsAbi } from '../abi/CSModuleV1Events.js';
import { CsmSDKModule } from '../common/class-primitives/csm-sdk-module.js';
import { NodeOperator, NodeOperatorInvite } from '../common/index.js';
import { EventRangeProps } from './types.js';
export declare class EventsSDK extends CsmSDKModule {
  protected get contract(): GetContractReturnType<
    typeof CSModuleAbi,
    WalletClient
  >;
  protected get contractV1Events(): GetContractReturnType<
    typeof CSModulev1EventsAbi,
    WalletClient
  >;
  getNodeOperatorsByAddress(
    address: Address,
    options?: EventRangeProps,
  ): Promise<NodeOperator[]>;
  getInvitesByAddress(
    address: Address,
    options?: EventRangeProps,
  ): Promise<NodeOperatorInvite[]>;
  parseEventsProps(props?: EventRangeProps): Promise<{
    fromBlock: bigint;
    toBlock: bigint;
    step: number;
  }>;
}
//# sourceMappingURL=events-sdk.d.ts.map
