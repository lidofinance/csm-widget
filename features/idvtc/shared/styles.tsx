import cn from 'classnames';
import { ComponentProps, FC } from 'react';
import s from './styles.module.css';

export const ConfirmationList: FC<ComponentProps<'ul'>> = ({
  className,
  ...props
}) => <ul {...props} className={cn(s.confirmationList, className)} />;
