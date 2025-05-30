/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isAddressEqual } from 'viem';
import { ROLES } from '../common/index.js';
import { isNotEmptyRoles, mergeRoles } from './merge.js';
import { sortEventsByBlockNumber } from '../common/utils/sort-events.js';
export const reconstructOperators = (logs, address) => {
    return logs
        .sort(sortEventsByBlockNumber)
        .reduce((operators, log) => {
        if (log.args.nodeOperatorId === undefined) {
            return operators;
        }
        switch (log.eventName) {
            case 'NodeOperatorAdded':
                return mergeRoles(operators, log.args.nodeOperatorId, {
                    [ROLES.MANAGER]: isAddressEqual(log.args.managerAddress, address),
                    [ROLES.REWARDS]: isAddressEqual(log.args.rewardAddress, address),
                });
            case 'NodeOperatorManagerAddressChanged':
                return mergeRoles(operators, log.args.nodeOperatorId, {
                    [ROLES.MANAGER]: isAddressEqual(log.args.newAddress, address),
                });
            case 'NodeOperatorRewardAddressChanged':
                return mergeRoles(operators, log.args.nodeOperatorId, {
                    [ROLES.REWARDS]: isAddressEqual(log.args.newAddress, address),
                });
            default:
                return operators;
        }
    }, [])
        .filter(isNotEmptyRoles);
};
//# sourceMappingURL=reconstruct-operators.js.map