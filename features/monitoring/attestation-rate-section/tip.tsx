import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { TipWrapper } from './styles';

export const Tip: FC<{ danger?: boolean }> = ({ danger = false }) => (
  <TipWrapper $danger={danger}>
    Check out the{' '}
    <MatomoLink href="https://dvt-homestaker.stakesaurus.com/best-practices/maximising-uptime-and-performance">
      tips
    </MatomoLink>{' '}
    on how to improve your performance
  </TipWrapper>
);
