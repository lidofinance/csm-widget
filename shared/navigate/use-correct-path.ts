import { PATH } from 'consts/urls';
import { useNodeOperator } from 'modules/web3';
import { useCallback } from 'react';
import { useShowFlags } from 'shared/hooks';
import { getRoleCode } from 'shared/node-operator/utils';
import { getCorrectPath } from './get-correct-path';

export function useCorrectPath(): (path: PATH) => PATH;
export function useCorrectPath(path: PATH): PATH;
// eslint-disable-next-line func-style
export function useCorrectPath(path?: PATH) {
  const { nodeOperator } = useNodeOperator();
  const flags = useShowFlags();

  const getPath = useCallback(
    (path: PATH) => getCorrectPath(path, getRoleCode(nodeOperator), flags),
    [flags, nodeOperator],
  );

  return path === undefined ? getPath : getPath(path);
}
