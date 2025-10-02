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
      filteredRoutes.findIndex(({ path, subpaths }) =>
        getIsActivePath(pathname, path, subpaths),
      ),
    [pathname, filteredRoutes],
  );

  if (filteredRoutes.length <= 1) return null;

  return (
    <SwitchWrapper $count={filteredRoutes.length}>
      {activePathIndex >= 0 && <Handle $active={activePathIndex} />}
      {filteredRoutes.map((route, index) => {
        return (
          <SwitcherItem
            key={route.title}
            href={route.path}
            warning={route.warning}
            active={activePathIndex === index}
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
