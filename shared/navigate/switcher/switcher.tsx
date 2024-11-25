import { FC, useMemo } from 'react';

import { Stack } from 'shared/components';
import { useRouterPath, useShowRule } from 'shared/hooks';
import { getIsActivePath } from 'utils';
import { Handle, SwitchWrapper } from './styles';
import { SwitcherItem } from './switcher-item';
import { SwitcherRoutes } from './types';

export type SwitchProps = {
  routes: SwitcherRoutes;
};

export const Switcher: FC<SwitchProps> = ({ routes }) => {
  const check = useShowRule();
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
          <SwitcherItem
            key={route.title}
            href={route.path}
            warning={route.warning}
          >
            <Stack gap="sm" center>
              {route.title}
              {route.suffix}
            </Stack>
          </SwitcherItem>
        );
      })}
    </SwitchWrapper>
  );
};
