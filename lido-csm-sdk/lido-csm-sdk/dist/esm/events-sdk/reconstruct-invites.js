/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { isAddressEqual } from 'viem';
import { ROLES } from '../common/index.js';
import { sortEventsByBlockNumber } from '../common/utils/sort-events.js';
export const reconstructInvites = (logs, address) => logs
    .sort(sortEventsByBlockNumber)
    .reduce((invites, log) => {
    if (log.args.nodeOperatorId === undefined) {
        return invites;
    }
    switch (log.eventName) {
        case 'NodeOperatorManagerAddressChangeProposed':
            return isAddressEqual(log.args.newProposedAddress, address)
                ? mergeInvites(invites, {
                    id: log.args.nodeOperatorId,
                    role: ROLES.MANAGER,
                })
                : mergeInvites(invites, { id: log.args.nodeOperatorId, role: ROLES.MANAGER }, false);
        case 'NodeOperatorRewardAddressChangeProposed':
            return isAddressEqual(log.args.newProposedAddress, address)
                ? mergeInvites(invites, {
                    id: log.args.nodeOperatorId,
                    role: ROLES.REWARDS,
                })
                : mergeInvites(invites, { id: log.args.nodeOperatorId, role: ROLES.REWARDS }, false);
        case 'NodeOperatorManagerAddressChanged':
            return mergeInvites(invites, { id: log.args.nodeOperatorId, role: ROLES.MANAGER }, false);
        case 'NodeOperatorRewardAddressChanged':
            return mergeInvites(invites, { id: log.args.nodeOperatorId, role: ROLES.REWARDS }, false);
        default:
            return invites;
    }
}, [])
    .sort((a, b) => Number(a.id - b.id) ||
    -Number(b.role === ROLES.REWARDS) - Number(a.role === ROLES.REWARDS));
const mergeInvites = (_list, invite, add = true) => {
    const list = Array.from(_list);
    const index = list.findIndex((item) => item.id === invite.id && item.role === invite.role);
    if (add && !index) {
        list.push(invite);
    }
    else if (!add && index >= 0) {
        list.splice(index, 1);
    }
    return list;
};
//# sourceMappingURL=reconstruct-invites.js.map