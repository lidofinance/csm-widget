import cn from 'classnames';
import { ComponentProps, FC, ReactNode } from 'react';
import s from './hero-illustration.module.css';
import { Illustration } from './illustration';

type FluidProps = { $fluid?: boolean };

export const HeroIllustrationSlot: FC<
  FluidProps & { children?: ReactNode }
> = ({ $fluid, children }) => (
  <div className={s.slot} data-fluid={$fluid || undefined}>
    {children}
  </div>
);

export const HeroIllustration: FC<
  ComponentProps<typeof Illustration> & FluidProps
> = ({ $fluid, className, ...props }) => (
  <Illustration
    {...props}
    className={cn(s.illustration, $fluid ? s.fluid : s.fixed, className)}
  />
);
