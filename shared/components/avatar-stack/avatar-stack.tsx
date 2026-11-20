import {
  Children,
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  isValidElement,
} from 'react';
import cn from 'classnames';
import s from './avatar-stack.module.css';

export type AvatarStackProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
  dataTestId?: { root?: string; item?: string };
};

export const AvatarStack = forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ size = 32, style, children, dataTestId, className, ...rest }, ref) => {
    const items = Children.toArray(children);
    return (
      <div
        ref={ref}
        className={cn(s.root, className)}
        style={{ ...style, '--local-size': `${size}px` } as CSSProperties}
        data-testid={dataTestId?.root}
        {...rest}
      >
        {items.map((child, index) => (
          <span
            className={s.slot}
            key={isValidElement(child) && child.key != null ? child.key : index}
            style={{ '--local-z': items.length - index } as CSSProperties}
            data-testid={dataTestId?.item}
          >
            {child}
          </span>
        ))}
      </div>
    );
  },
);
AvatarStack.displayName = 'AvatarStack';
