import { useCompareWithRouterPath } from 'shared/hooks/use-compare-with-router-path';

import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import { SwitchItemStyled } from './styles';

type Props = {
  href: PATH;
};

export const SwitchItem: FC<PropsWithChildren<Props>> = ({ href, ...rest }) => {
  const active = useCompareWithRouterPath(href);

  return <SwitchItemStyled href={href} $active={active} {...rest} />;
};
