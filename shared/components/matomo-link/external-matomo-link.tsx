import { External } from '@lidofinance/lido-ui';
import { ComponentProps, FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';

export const ExternalMatomoLink: FC<ComponentProps<typeof MatomoLink>> = ({
  children,
  ...props
}) => (
  <MatomoLink {...props}>
    {children} <External />
  </MatomoLink>
);
