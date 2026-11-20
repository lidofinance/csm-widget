import { PATH } from 'consts/urls';
import { FC, PropsWithChildren } from 'react';
import { LocalLink } from '../local-link';
import s from './styles.module.css';

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
    <LocalLink
      href={href}
      className={s.item}
      data-active={active || undefined}
      data-warning={warning || undefined}
      data-testid="switcherTab"
      {...rest}
    />
  );
};
