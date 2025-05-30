import { ROLES } from '../common/index.js';
import { NodeOperator, NodeOperatorId } from '../common/tyles.js';
export type RoleModifier = {
  [key in ROLES]?: boolean;
};
export declare const appendNodeOperator: (
  list: NodeOperator[],
  { id, roles }: NodeOperator,
) => NodeOperator[];
export declare const mergeRoles: (
  _list: NodeOperator[],
  id: NodeOperatorId,
  patch: RoleModifier,
) => NodeOperator[];
export declare const isNotEmptyRoles: (item: NodeOperator) => boolean;
export declare const applyPatch: (
  item: NodeOperator,
  patch: RoleModifier,
) => NodeOperator;
export declare const modifyRoles: (
  roles: ROLES[],
  patch: RoleModifier,
) => ROLES[];
export declare const packRoles: (roles: RoleModifier) => ROLES[];
//# sourceMappingURL=merge.d.ts.map
