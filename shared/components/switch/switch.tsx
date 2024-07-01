import { FC, useMemo } from 'react';

import { SwitchItem } from './switch-item';
import { SwitchWrapper, Handle } from './styles';
import { SwitchProps } from './types';
import { useRouterPath } from 'shared/hooks';
import { getIsActivePath } from 'utils';
import { useNodeOperatorRoles } from 'providers/node-operator-provider';

export const Switch: FC<SwitchProps> = ({ active, routes }) => {
  const roles = useNodeOperatorRoles();
  const pathname = useRouterPath();

  const filteredRoutes = useMemo(() => {
    return routes.filter(
      (r) =>
        !r.roles ||
        (roles.manager && r.roles.manager) ||
        (roles.rewards && r.roles.rewards),
    );
  }, [roles.manager, roles.rewards, routes]);

  const activePathIndex = useMemo(
    () =>
      filteredRoutes.findIndex(({ path }) => getIsActivePath(pathname, path)),
    [pathname, filteredRoutes],
  );

  if (filteredRoutes.length <= 1) return null;

  return (
    <SwitchWrapper $count={filteredRoutes.length}>
      <Handle $active={active ?? activePathIndex} />
      {filteredRoutes.map((route) => {
        return (
          <SwitchItem key={route.title} href={route.path}>
            {route.title}
          </SwitchItem>
        );
      })}
    </SwitchWrapper>
  );
};
