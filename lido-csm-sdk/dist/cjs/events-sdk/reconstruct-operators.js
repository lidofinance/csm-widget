"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructOperators = void 0;
const viem_1 = require("viem");
const index_js_1 = require("../common/index.js");
const merge_js_1 = require("./merge.js");
const reconstructOperators = (logs, address) => logs
    .reduce((operators, log) => {
    if (log.args.nodeOperatorId === undefined) {
        return operators;
    }
    switch (log.eventName) {
        case 'NodeOperatorAdded':
            return (0, merge_js_1.mergeRoles)(operators, log.args.nodeOperatorId, {
                [index_js_1.ROLES.MANAGER]: (0, viem_1.isAddressEqual)(log.args.managerAddress, address),
                [index_js_1.ROLES.REWARDS]: (0, viem_1.isAddressEqual)(log.args.rewardAddress, address),
            });
        case 'NodeOperatorManagerAddressChanged':
            return (0, merge_js_1.mergeRoles)(operators, log.args.nodeOperatorId, {
                [index_js_1.ROLES.MANAGER]: (0, viem_1.isAddressEqual)(log.args.newAddress, address),
            });
        case 'NodeOperatorRewardAddressChanged':
            return (0, merge_js_1.mergeRoles)(operators, log.args.nodeOperatorId, {
                [index_js_1.ROLES.REWARDS]: (0, viem_1.isAddressEqual)(log.args.newAddress, address),
            });
        default:
            return operators;
    }
}, [])
    .filter(merge_js_1.isNotEmptyRoles);
exports.reconstructOperators = reconstructOperators;
//# sourceMappingURL=reconstruct-operators.js.map