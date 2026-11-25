import cn from 'classnames';
import { FC, ReactNode } from 'react';
import s from './icon-circle.module.css';

type IconCircleProps = {
  children: ReactNode;
  className?: string;
};

export const IconCircle: FC<IconCircleProps> = ({ children, className }) => (
  <div className={cn(s.root, className)}>{children}</div>
);
