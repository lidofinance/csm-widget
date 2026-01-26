import { ArrowBack, Button, ButtonIcon } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { Stack } from 'shared/components';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { useWrappedActions, useWrappedState } from '../context';

type SlideNavigationProps = {
  buttonText: string;
};

export const SlideNavigation: FC<SlideNavigationProps> = ({ buttonText }) => {
  const { goBack, goNext } = useWrappedActions();
  const { currentIndex } = useWrappedState();
  const canGoBack = currentIndex > 1;
  const isFirstSlide = currentIndex === 0;

  const handleNext = () => {
    if (isFirstSlide) {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedLetsGo);
    }
    goNext();
  };

  return (
    <Stack gap="md">
      {canGoBack && (
        <ButtonIcon
          onClick={goBack}
          variant="outlined"
          color="secondary"
          size="sm"
          icon={<ArrowBack width={16} />}
        ></ButtonIcon>
      )}
      <Button onClick={handleNext} fullwidth color="secondary" size="sm">
        {buttonText}
      </Button>
    </Stack>
  );
};
