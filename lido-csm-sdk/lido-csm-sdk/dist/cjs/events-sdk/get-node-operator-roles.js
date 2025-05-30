"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeOperatorRoles = void 0;
const viem_1 = require("viem");
const index_js_1 = require("../common/index.js");
const merge_js_1 = require("./merge.js");
const getNodeOperatorRoles = ({ managerAddress, rewardsAddress, }, address) => (0, merge_js_1.packRoles)({
    [index_js_1.ROLES.MANAGER]: (0, viem_1.isAddressEqual)(managerAddress, address),
    [index_js_1.ROLES.REWARDS]: (0, viem_1.isAddressEqual)(rewardsAddress, address),
});
exports.getNodeOperatorRoles = getNodeOperatorRoles;
//# sourceMappingURL=get-node-operator-roles.js.map