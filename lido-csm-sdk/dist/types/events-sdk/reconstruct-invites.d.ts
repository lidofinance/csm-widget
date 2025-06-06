import { Address, GetAbiItemReturnType, Log } from 'viem';
import { CSModuleAbi } from '../abi/CSModule.js';
import { NodeOperatorInvite } from '../common/tyles.js';
type ChangeAddressLogs = Log<bigint, number, false, GetAbiItemReturnType<typeof CSModuleAbi, 'NodeOperatorManagerAddressChangeProposed'>, false> | Log<bigint, number, false, GetAbiItemReturnType<typeof CSModuleAbi, 'NodeOperatorRewardAddressChangeProposed'>, false> | Log<bigint, number, false, GetAbiItemReturnType<typeof CSModuleAbi, 'NodeOperatorManagerAddressChanged'>, false> | Log<bigint, number, false, GetAbiItemReturnType<typeof CSModuleAbi, 'NodeOperatorRewardAddressChanged'>, false>;
export declare const reconstructInvites: (logs: ChangeAddressLogs[], address: Address) => NodeOperatorInvite[];
export {};
//# sourceMappingURL=reconstruct-invites.d.ts.map