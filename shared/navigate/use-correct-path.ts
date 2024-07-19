import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';
import { useNodeOperatorRoles } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { redirectionMap } from './redirection-map';
import { getRoleCode } from 'shared/node-operator';

export const getCorrectPath = (path: PATH, role: ROLE_CODE) =>
  redirectionMap[path]?.[role] ?? path;

export function useCorrectPath(): (path: PATH) => PATH;
export function useCorrectPath(path: PATH): PATH;
// eslint-disable-next-line func-style
export function useCorrectPath(path?: PATH) {
  const roles = useNodeOperatorRoles();
  const role = useMemo(() => getRoleCode(roles), [roles]);

  const getPath = useCallback(
    (path: PATH) => getCorrectPath(path, role),
    [role],
  );

  return path === undefined ? getPath : getPath(path);
}
