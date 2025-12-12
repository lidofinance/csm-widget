import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { PERFORMANCE_TIPS_LINK } from 'consts/external-links';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { TipWrapper } from './styles';

export const Tip: FC<{ danger?: boolean }> = ({ danger = false }) => (
  <TipWrapper $danger={danger}>
    Check out{' '}
    <MatomoLink
      href={PERFORMANCE_TIPS_LINK}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.performanceTipsLink}
    >
      tips
    </MatomoLink>{' '}
    on how to improve your performance
  </TipWrapper>
);
