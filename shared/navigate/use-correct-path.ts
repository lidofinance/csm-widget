import { PATH } from 'consts/urls';
import { useCallback } from 'react';
import { useShowFlagsState } from 'shared/hooks';
import { resolveNavigable } from './gates/route-terminal';

export function useCorrectPath(): (path: PATH) => PATH;
export function useCorrectPath(path: PATH): PATH;
// eslint-disable-next-line func-style
export function useCorrectPath(path?: PATH) {
  const state = useShowFlagsState();

  const getPath = useCallback(
    (path: PATH) => resolveNavigable(path, state),
    [state],
  );

  return path === undefined ? getPath : getPath(path);
}
