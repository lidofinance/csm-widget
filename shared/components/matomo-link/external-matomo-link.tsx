import { External } from '@lidofinance/lido-ui';
import { ComponentProps, FC } from 'react';
import { MatomoLink } from '../matomo-link/matomo-link';
import styled from 'styled-components';

export const ExternalMatomoLink: FC<ComponentProps<typeof MatomoLink>> = ({
  children,
  ...props
}) => (
  <MatomoLink {...props}>
    {children} <Icon />
  </MatomoLink>
);

const Icon = styled(External)`
  margin: -12px -12px -12px 0;
`;
