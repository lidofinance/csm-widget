"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packRoles = exports.modifyRoles = exports.applyPatch = exports.isNotEmptyRoles = exports.mergeRoles = exports.appendNodeOperator = void 0;
const index_js_1 = require("../common/index.js");
const allRoles = [index_js_1.ROLES.REWARDS, index_js_1.ROLES.MANAGER];
const appendNodeOperator = (list, { id, roles }) => {
    return (0, exports.mergeRoles)(list, id, {
        [index_js_1.ROLES.MANAGER]: roles.includes(index_js_1.ROLES.MANAGER),
        [index_js_1.ROLES.REWARDS]: roles.includes(index_js_1.ROLES.REWARDS),
    });
};
exports.appendNodeOperator = appendNodeOperator;
const mergeRoles = (_list, id, patch) => {
    const list = Array.from(_list);
    const index = list.findIndex((item) => item.id === id);
    const item = (0, exports.applyPatch)(list[index] ?? { id, roles: [] }, patch);
    list.splice(index >= 0 ? index : list.length, 1, item);
    return list;
};
exports.mergeRoles = mergeRoles;
const isNotEmptyRoles = (item) => item.roles.length > 0;
exports.isNotEmptyRoles = isNotEmptyRoles;
const applyPatch = (item, patch) => ({
    ...item,
    roles: (0, exports.modifyRoles)(item.roles, patch),
});
exports.applyPatch = applyPatch;
const modifyRoles = (roles, patch) => (0, exports.packRoles)({
    [index_js_1.ROLES.MANAGER]: patch[index_js_1.ROLES.MANAGER] ?? roles.includes(index_js_1.ROLES.MANAGER),
    [index_js_1.ROLES.REWARDS]: patch[index_js_1.ROLES.REWARDS] ?? roles.includes(index_js_1.ROLES.REWARDS),
});
exports.modifyRoles = modifyRoles;
const packRoles = (roles) => allRoles.filter((role) => roles[role]);
exports.packRoles = packRoles;
//# sourceMappingURL=merge.js.map