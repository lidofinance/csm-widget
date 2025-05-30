"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructInvites = void 0;
const viem_1 = require("viem");
const index_js_1 = require("../common/index.js");
const sort_events_js_1 = require("../common/utils/sort-events.js");
const reconstructInvites = (logs, address) => logs
    .sort(sort_events_js_1.sortEventsByBlockNumber)
    .reduce((invites, log) => {
    if (log.args.nodeOperatorId === undefined) {
        return invites;
    }
    switch (log.eventName) {
        case 'NodeOperatorManagerAddressChangeProposed':
            return (0, viem_1.isAddressEqual)(log.args.newProposedAddress, address)
                ? mergeInvites(invites, {
                    id: log.args.nodeOperatorId,
                    role: index_js_1.ROLES.MANAGER,
                })
                : mergeInvites(invites, { id: log.args.nodeOperatorId, role: index_js_1.ROLES.MANAGER }, false);
        case 'NodeOperatorRewardAddressChangeProposed':
            return (0, viem_1.isAddressEqual)(log.args.newProposedAddress, address)
                ? mergeInvites(invites, {
                    id: log.args.nodeOperatorId,
                    role: index_js_1.ROLES.REWARDS,
                })
                : mergeInvites(invites, { id: log.args.nodeOperatorId, role: index_js_1.ROLES.REWARDS }, false);
        case 'NodeOperatorManagerAddressChanged':
            return mergeInvites(invites, { id: log.args.nodeOperatorId, role: index_js_1.ROLES.MANAGER }, false);
        case 'NodeOperatorRewardAddressChanged':
            return mergeInvites(invites, { id: log.args.nodeOperatorId, role: index_js_1.ROLES.REWARDS }, false);
        default:
            return invites;
    }
}, [])
    .sort((a, b) => Number(a.id - b.id) ||
    -Number(b.role === index_js_1.ROLES.REWARDS) - Number(a.role === index_js_1.ROLES.REWARDS));
exports.reconstructInvites = reconstructInvites;
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