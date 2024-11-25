import { useCompareWithRouterPath } from 'shared/hooks/use-compare-with-router-path';

import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import { SwitchItemStyled } from './styles';

type Props = {
  href: PATH;
  warning?: boolean;
};

export const SwitcherItem: FC<PropsWithChildren<Props>> = ({
  href,
  warning,
  ...rest
}) => {
  const active = useCompareWithRouterPath(href);

  return (
    <SwitchItemStyled
      href={href}
      $active={active}
      $warning={warning}
      {...rest}
    />
  );
};
