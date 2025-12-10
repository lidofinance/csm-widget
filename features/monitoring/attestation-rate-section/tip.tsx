import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { TipWrapper } from './styles';
import { PERFORMANCE_TIPS_LINK } from 'consts/external-links';

export const Tip: FC<{ danger?: boolean }> = ({ danger = false }) => (
  <TipWrapper $danger={danger}>
    Check out <MatomoLink href={PERFORMANCE_TIPS_LINK}>tips</MatomoLink> on how
    to improve your performance
  </TipWrapper>
);
