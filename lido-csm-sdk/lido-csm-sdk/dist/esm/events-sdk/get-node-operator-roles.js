import { isAddressEqual } from 'viem';
import { ROLES } from '../common/index.js';
import { packRoles } from './merge.js';
export const getNodeOperatorRoles = ({ managerAddress, rewardsAddress, }, address) => packRoles({
    [ROLES.MANAGER]: isAddressEqual(managerAddress, address),
    [ROLES.REWARDS]: isAddressEqual(rewardsAddress, address),
});
//# sourceMappingURL=get-node-operator-roles.js.map