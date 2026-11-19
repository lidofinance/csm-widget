import {
  Children,
  CSSProperties,
  forwardRef,
  HTMLAttributes,
  isValidElement,
} from 'react';
import styled from 'styled-components';

export type AvatarStackProps = HTMLAttributes<HTMLDivElement> & {
  size?: number;
  dataTestId?: { root?: string; item?: string };
};

const Slot = styled.span`
  position: relative;
  z-index: var(--local-z);
  display: block;
  flex: none;
  box-sizing: border-box;
  width: var(--local-size);
  height: var(--local-size);
  overflow: hidden;
  border: 1px solid var(--lido-app-ui-color-border-default);
  border-radius: 50%;
  background: var(--lido-app-ui-color-background-surface);
  transition:
    transform var(--lido-app-ui-duration-fast-exit)
      var(--lido-app-ui-easing-exit),
    z-index 0s linear var(--lido-app-ui-duration-fast-exit);

  &:not(:first-child) {
    margin-inline-start: calc(var(--local-size) / -4);
  }

  & > * {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
  }

  a,
  button {
    display: block;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    outline: none;
  }

  img,
  svg {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:has(:focus-visible) {
    z-index: 1000;
    transform: scale(1.1);
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: 2px;
    transition:
      transform var(--lido-app-ui-duration-fast) var(--lido-app-ui-easing-out),
      z-index 0s linear 0s;
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover {
      z-index: 1000;
      transform: scale(1.1);
      transition:
        transform var(--lido-app-ui-duration-fast) var(--lido-app-ui-easing-out),
        z-index 0s linear 0s;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &:hover,
    &:has(:focus-visible) {
      transform: none;
      transition: none;
    }
  }
`;

const Root = styled.div`
  display: flex;
  isolation: isolate;

  @media (prefers-reduced-motion: no-preference) {
    &:has(:focus-visible) ${Slot}:not(:has(:focus-visible)) {
      transition:
        transform var(--lido-app-ui-duration-fast-exit)
          var(--lido-app-ui-easing-exit),
        z-index 0s;
    }
  }

  @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
    &:has(${Slot}:hover) ${Slot}:not(:hover) {
      transition:
        transform var(--lido-app-ui-duration-fast-exit)
          var(--lido-app-ui-easing-exit),
        z-index 0s;
    }
  }
`;

export const AvatarStack = forwardRef<HTMLDivElement, AvatarStackProps>(
  ({ size = 32, style, children, dataTestId, ...rest }, ref) => {
    const items = Children.toArray(children);
    return (
      <Root
        ref={ref}
        style={{ ...style, '--local-size': `${size}px` } as CSSProperties}
        data-testid={dataTestId?.root}
        {...rest}
      >
        {items.map((child, index) => (
          <Slot
            key={isValidElement(child) && child.key != null ? child.key : index}
            style={{ '--local-z': items.length - index } as CSSProperties}
            data-testid={dataTestId?.item}
          >
            {child}
          </Slot>
        ))}
      </Root>
    );
  },
);
AvatarStack.displayName = 'AvatarStack';
