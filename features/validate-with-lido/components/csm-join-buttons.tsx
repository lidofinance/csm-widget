import { LIDO_OPERATOR_PORTAL_BASE } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { ExternalCtaButton, InternalButtonLink } from './button-links';

type CsmJoinButtonsProps = {
  size: 'small' | 'big';
  joinTestId?: string;
};

export const CsmJoinButtons: FC<CsmJoinButtonsProps> = ({
  size,
  joinTestId,
}) => (
  <>
    <InternalButtonLink
      href={PATH.CSM}
      variant="primary"
      size={size}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.validateJoinCsm}
      data-testid={joinTestId}
    >
      Join CSM
    </InternalButtonLink>
    <ExternalCtaButton
      href={LIDO_OPERATOR_PORTAL_BASE}
      variant="outline"
      size={size}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.validateLearnMoreCsm}
    >
      Learn More
    </ExternalCtaButton>
  </>
);
