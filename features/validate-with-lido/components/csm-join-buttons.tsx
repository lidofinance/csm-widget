import { Button, IconLink } from '@lidofinance/lido-app-ui';
import { LIDO_OPERATOR_PORTAL_BASE } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

type CsmJoinButtonsProps = {
  size: 'small' | 'big';
  joinTestId?: string;
  joinLabel?: string;
};

export const CsmJoinButtons: FC<CsmJoinButtonsProps> = ({
  size,
  joinTestId,
  joinLabel = 'Join CSM',
}) => (
  <>
    <Button
      href={PATH.CSM}
      variant="primary"
      size={size}
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.validateJoinCsm)
      }
      data-testid={joinTestId}
    >
      {joinLabel}
    </Button>
    <Button
      href={LIDO_OPERATOR_PORTAL_BASE}
      variant="outline"
      size={size}
      iconRight={<IconLink />}
      onClick={() =>
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.validateLearnMoreCsm)
      }
    >
      Learn More
    </Button>
  </>
);
