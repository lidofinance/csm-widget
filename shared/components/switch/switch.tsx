import { FC, useMemo } from 'react';

import { useRouterPath } from 'shared/hooks';
import { getIsActivePath } from 'utils';
import { Stack } from '../stack/stack';
import { Handle, SwitchWrapper } from './styles';
import { SwitchItem } from './switch-item';
import { SwitchProps } from './types';
import { useShowSwitchRules } from './use-show-switch-rules';

export const Switch: FC<SwitchProps> = ({ routes }) => {
  const check = useShowSwitchRules();
  const pathname = useRouterPath();

  const filteredRoutes = useMemo(() => {
    return routes.filter(
      ({ showRules }) => !showRules || showRules.some(check),
    );
  }, [check, routes]);

  const activePathIndex = useMemo(
    () =>
      filteredRoutes.findIndex(({ path }) => getIsActivePath(pathname, path)),
    [pathname, filteredRoutes],
  );

  if (filteredRoutes.length <= 1) return null;

  return (
    <SwitchWrapper $count={filteredRoutes.length}>
      {activePathIndex >= 0 && <Handle $active={activePathIndex} />}
      {filteredRoutes.map((route) => {
        return (
          <SwitchItem
            key={route.title}
            href={route.path}
            warning={route.warning}
          >
            <Stack gap="sm" center>
              {route.title}
              {route.suffix}
            </Stack>
          </SwitchItem>
        );
      })}
    </SwitchWrapper>
  );
};
