import { Button, IconArrowRight } from '@lidofinance/lido-app-ui';
import { HOW_TO_EXIT_VALIDATOR_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { trackMatomoEvent } from 'utils';
import type { AlertDefinition } from '../types';

export const exitRequestedDefinition: AlertDefinition = {
  severity: 'important',
  title: 'You have an Exit Request',
  Body: () => (
    <>
      Your validator has been requested to exit by the Lido protocol. You need
      to exit the validator from the CL as soon as possible to avoid the penalty
      measures.
    </>
  ),
  Actions: ({ onNavigate }) => (
    <Button
      size="small"
      variant="outline"
      href={HOW_TO_EXIT_VALIDATOR_LINK}
      iconRight={<IconArrowRight />}
      onClick={() => {
        trackMatomoEvent(
          MATOMO_CLICK_EVENTS_TYPES.howToExitLinkRequestToExitAlert,
        );
        onNavigate();
      }}
    >
      How to exit?
    </Button>
  ),
};
