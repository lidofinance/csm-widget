import { FC, useMemo } from 'react';

import { useNodeOperatorRoles } from 'providers/node-operator-provider';
import { useRouterPath } from 'shared/hooks';
import { getRoleCode } from 'shared/node-operator';
import { getIsActivePath } from 'utils';
import { Handle, SwitchWrapper } from './styles';
import { SwitchItem } from './switch-item';
import { SwitchProps } from './types';

export const Switch: FC<SwitchProps> = ({ active, routes }) => {
  const roles = useNodeOperatorRoles();
  const role = useMemo(() => getRoleCode(roles), [roles]);

  const pathname = useRouterPath();

  const filteredRoutes = useMemo(() => {
    return routes.filter(({ roles }) => !roles || roles.includes(role));
  }, [role, routes]);

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
