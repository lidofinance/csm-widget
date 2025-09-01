import { useFeatureFlags } from 'config/feature-flags';
import { ROLE_CODE } from 'consts/roles';
import { PATH } from 'consts/urls';
import { useDappStatus, useNodeOperator } from 'modules/web3';
import { useCallback } from 'react';
import { getRoleCode } from 'shared/node-operator';
import { redirectionMap, RedirectionProps } from './redirection-map';

const getCorrectPath = (
  path: PATH,
  role: ROLE_CODE,
  flags: RedirectionProps,
) => {
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
  const featureFlags = useFeatureFlags();
  const { isAccountActive } = useDappStatus();

  const getPath = useCallback(
    (path: PATH) =>
      getCorrectPath(path, getRoleCode(nodeOperator), {
        ...featureFlags,
        isAccountActive,
      }),
    [featureFlags, isAccountActive, nodeOperator],
  );

  return path === undefined ? getPath : getPath(path);
}
