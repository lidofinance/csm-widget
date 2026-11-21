import cn from 'classnames';
import { ComponentProps, FC } from 'react';
import s from './styles.module.css';

export const MemberCardStyle: FC<ComponentProps<'div'>> = ({
  className,
  ...props
}) => <div {...props} className={cn(s.memberCard, className)} />;
