import type { Component } from 'types';

export const SVGGradientDefs: Component<'svg'> = (props) => (
  <svg
    {...props}
    style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        id="lido-primary-gradient"
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#5448FF" />
        <stop offset="100%" stopColor="#8349FF" />
      </linearGradient>
    </defs>
  </svg>
);
