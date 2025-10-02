import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import { SwitchItemStyled } from './styles';

type Props = {
  href: PATH;
  warning?: boolean;
  active?: boolean;
};

export const SwitcherItem: FC<PropsWithChildren<Props>> = ({
  href,
  warning,
  active = false,
  ...rest
}) => {
  return (
    <SwitchItemStyled
      href={href}
      $active={active}
      $warning={warning}
      {...rest}
    />
  );
};
