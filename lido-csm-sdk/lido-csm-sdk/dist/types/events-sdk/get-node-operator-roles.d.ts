import { Address } from 'viem';
import { ROLES } from '../common/index.js';
import { NodeOperatorInfo } from '../operator-sdk/types.js';
export declare const getNodeOperatorRoles: (
  {
    managerAddress,
    rewardsAddress,
  }: Pick<NodeOperatorInfo, 'rewardsAddress' | 'managerAddress'>,
  address: Address,
) => ROLES[];
//# sourceMappingURL=get-node-operator-roles.d.ts.map
