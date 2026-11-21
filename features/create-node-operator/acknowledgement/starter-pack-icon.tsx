import { FC, HTMLAttributes } from 'react';
import cn from 'classnames';
import s from './starter-pack-icon.module.css';

export const StarterPackIcon: FC<HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => <span {...props} className={cn(s.root, className)} />;
