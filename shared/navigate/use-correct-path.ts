import { PATH } from 'consts/urls';
import { useCallback } from 'react';
import { useShowFlags } from 'shared/hooks';
import { getCorrectPath } from './get-correct-path';

export function useCorrectPath(): (path: PATH) => PATH;
export function useCorrectPath(path: PATH): PATH;
// eslint-disable-next-line func-style
export function useCorrectPath(path?: PATH) {
  const flags = useShowFlags();

  const getPath = useCallback(
    (path: PATH) => getCorrectPath(path, flags),
    [flags],
  );

  return path === undefined ? getPath : getPath(path);
}
