import type { Address } from 'viem';
import { NodeOperatorId, ROLES } from '../common/index.js';
import { CommonTransactionProps } from '../core-sdk/types.js';
export type ChangeRoleProps = CommonTransactionProps & {
  nodeOperatorId: NodeOperatorId;
  address: Address;
};
export type ResetRoleProps = CommonTransactionProps & {
  nodeOperatorId: NodeOperatorId;
};
export type ConfirmRoleProps = CommonTransactionProps & {
  nodeOperatorId: NodeOperatorId;
};
export type WithRole<T> = T & {
  role: ROLES;
};
//# sourceMappingURL=types.d.ts.map
