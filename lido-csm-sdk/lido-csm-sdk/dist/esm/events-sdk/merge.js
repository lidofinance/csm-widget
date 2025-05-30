import { ROLES } from '../common/index.js';
const allRoles = [ROLES.REWARDS, ROLES.MANAGER];
export const appendNodeOperator = (list, { id, roles }) => {
    return mergeRoles(list, id, {
        [ROLES.MANAGER]: roles.includes(ROLES.MANAGER),
        [ROLES.REWARDS]: roles.includes(ROLES.REWARDS),
    });
};
export const mergeRoles = (_list, id, patch) => {
    const list = Array.from(_list);
    const index = list.findIndex((item) => item.id === id);
    const item = applyPatch(list[index] ?? { id, roles: [] }, patch);
    list.splice(index >= 0 ? index : list.length, 1, item);
    return list;
};
export const isNotEmptyRoles = (item) => item.roles.length > 0;
export const applyPatch = (item, patch) => ({
    ...item,
    roles: modifyRoles(item.roles, patch),
});
export const modifyRoles = (roles, patch) => packRoles({
    [ROLES.MANAGER]: patch[ROLES.MANAGER] ?? roles.includes(ROLES.MANAGER),
    [ROLES.REWARDS]: patch[ROLES.REWARDS] ?? roles.includes(ROLES.REWARDS),
});
export const packRoles = (roles) => allRoles.filter((role) => roles[role]);
//# sourceMappingURL=merge.js.map