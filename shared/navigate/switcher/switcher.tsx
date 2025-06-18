import { FC, useMemo } from 'react';

import { Stack } from 'shared/components';
import { useFilterShowRules, useRouterPath } from 'shared/hooks';
import { getIsActivePath } from 'utils';
import { Handle, SwitchWrapper } from './styles';
import { SwitcherItem } from './switcher-item';
import { SwitcherRoutes } from './types';

export type SwitchProps = {
  routes: SwitcherRoutes;
};

export const Switcher: FC<SwitchProps> = ({ routes }) => {
  const pathname = useRouterPath();

  const filteredRoutes = useFilterShowRules(routes);

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
