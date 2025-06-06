import { Address, GetAbiItemReturnType, Log } from 'viem';
import { CSModuleAbi } from '../abi/CSModule.js';
import { NodeOperator } from '../common/tyles.js';
type NodeOperatorLogs = Log<bigint, number, false, GetAbiItemReturnType<typeof CSModuleAbi, 'NodeOperatorAdded'>, false> | Log<bigint, number, false, GetAbiItemReturnType<typeof CSModuleAbi, 'NodeOperatorManagerAddressChanged'>, false> | Log<bigint, number, false, GetAbiItemReturnType<typeof CSModuleAbi, 'NodeOperatorRewardAddressChanged'>, false>;
export declare const reconstructOperators: (logs: NodeOperatorLogs[], address: Address) => NodeOperator[];
export {};
//# sourceMappingURL=reconstruct-operators.d.ts.map