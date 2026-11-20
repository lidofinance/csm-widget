import cn from 'classnames';
import { CSSProperties } from 'react';
import { Component } from 'types';
import s from './background-gradient.module.css';

export type BackgroundGradientComponent = Component<
  'svg',
  { width: number; height: number }
>;

// svg gradient looks better than css gradient in some browsers

export const BackgroundGradient: BackgroundGradientComponent = (props) => {
  const { width, height, className, style, ...rest } = props;

  return (
    <svg
      width={width}
      height={height}
      {...rest}
      className={cn(s.root, className)}
      style={
        {
          '--gradient-width': `${width}px`,
          '--gradient-height': `${height}px`,
          ...style,
        } as CSSProperties
      }
    >
      <radialGradient id="background-gradient" cx="50%" y="50%">
        <stop className={s.start} offset="0%" />
        <stop className={s.stop} offset="100%" />
      </radialGradient>
      <rect
        width={width}
        height={height}
        opacity=".1"
        fill="url(#background-gradient)"
      />
    </svg>
  );
};
