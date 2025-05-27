import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';
import { useCallback } from 'react';
import { getRoleCode } from 'shared/node-operator';
import { redirectionMap } from './redirection-map';
import { useNodeOperator } from 'modules/web3';

const getCorrectPath = (path: PATH, role: ROLE_CODE) =>
  redirectionMap[path]?.[role] ?? path;

export function useCorrectPath(): (path: PATH) => PATH;
export function useCorrectPath(path: PATH): PATH;
// eslint-disable-next-line func-style
export function useCorrectPath(path?: PATH) {
  const { nodeOperator } = useNodeOperator();

  const getPath = useCallback(
    (path: PATH) => getCorrectPath(path, getRoleCode(nodeOperator)),
    [nodeOperator],
  );

  return path === undefined ? getPath : getPath(path);
}
