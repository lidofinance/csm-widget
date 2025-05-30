import type { Address, Hex } from 'viem';
import { DepositDataKey, NodeOperatorShortInfo } from '../common/index.js';
import { CommonTransactionProps, PermitSignature } from '../core-sdk/types.js';
export type AddNodeOperatorResult = NodeOperatorShortInfo;
export type AddNodeOperatorProps =
  CommonTransactionProps<AddNodeOperatorResult> & {
    amount: bigint;
    depositData: DepositDataKey[];
    rewardsAddress?: Address | string;
    managerAddress?: Address | string;
    extendedManagerPermissions?: boolean;
    referrer?: Address;
    permit?: PermitSignature;
  };
export type AddNodeOperatorInnerProps =
  CommonTransactionProps<AddNodeOperatorResult> & {
    amount: bigint;
    keysCount: bigint;
    publicKeys: Hex;
    signatures: Hex;
    managementProperties: {
      rewardAddress: Address;
      managerAddress: Address;
      extendedManagerPermissions: boolean;
    };
    referrer: Address;
    permit?: PermitSignature;
  };
//# sourceMappingURL=types.d.ts.map
