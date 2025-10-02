import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';
import { useNodeOperator } from 'modules/web3';
import { useCallback } from 'react';
import { ShowFlags, useShowFlags } from 'shared/hooks';
import { getRoleCode } from 'shared/node-operator';
import { redirectionMap } from './redirection-map';

const getCorrectPath = (path: PATH, role: ROLE_CODE, flags: ShowFlags) => {
  const redirection = redirectionMap[path];
  const roleMap =
    typeof redirection === 'function' ? redirection(flags) : redirection;
  return roleMap?.[role] ?? path;
};

export function useCorrectPath(): (path: PATH) => PATH;
export function useCorrectPath(path: PATH): PATH;
// eslint-disable-next-line func-style
export function useCorrectPath(path?: PATH) {
  const { nodeOperator } = useNodeOperator();
  const flags = useShowFlags();

  // TODO: refactor redirectionMap
  const getPath = useCallback(
    (path: PATH) => getCorrectPath(path, getRoleCode(nodeOperator), flags),
    [flags, nodeOperator],
  );

  return path === undefined ? getPath : getPath(path);
}
