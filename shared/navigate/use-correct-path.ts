import { PATH } from 'consts/urls';
import { NodeOperatorContext } from 'modules/web3/operator-provider/node-operator-provider';
import { useCallback, useContext } from 'react';
import { useShowFlags } from 'shared/hooks';
import { getCorrectPath } from './get-correct-path';

export function useCorrectPath(): (path: PATH) => PATH;
export function useCorrectPath(path: PATH): PATH;
// eslint-disable-next-line func-style
export function useCorrectPath(path?: PATH) {
  // Headers rendered outside the operator provider have nothing to correct against.
  // The provider's presence is fixed for a mounted component, so hook order is stable.
  const hasProvider = !!useContext(NodeOperatorContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const flags = hasProvider ? useShowFlags() : null;

  const getPath = useCallback(
    (path: PATH) => (flags ? getCorrectPath(path, flags) : path),
    [flags],
  );

  return path === undefined ? getPath : getPath(path);
}
