import type { LinkComponentProps } from '@lidofinance/lido-app-ui';
import { forwardRef } from 'react';

export const ExternalLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  ({ target = '_blank', rel = 'noopener noreferrer', ...rest }, ref) => (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a ref={ref} target={target} rel={rel} {...rest} />
  ),
);
