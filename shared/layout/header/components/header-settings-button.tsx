import { SETTINGS_PATH } from 'consts/urls';
import { useCallback } from 'react';
import { usePrefixedPush, useRouterPath } from 'shared/hooks';
import { HeaderControlButton } from './header-control-button';

import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';

export const HeaderSettingsButton = () => {
  const push = usePrefixedPush();
  const route = useRouterPath();
  const handleClick = useCallback(() => push(SETTINGS_PATH), [push]);

  return (
    <HeaderControlButton
      isActive={route === SETTINGS_PATH}
      onClick={handleClick}
    >
      <GearIcon />
    </HeaderControlButton>
  );
};
