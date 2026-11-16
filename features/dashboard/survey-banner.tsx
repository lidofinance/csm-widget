import {
  Banner,
  Button,
  CloseButton,
  IconListCheck,
  Stack,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { FC } from 'react';
import { SurveyVariant, useSurveyEnabled } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';

const COPY: Record<
  SurveyVariant,
  { title: string; description: string; button: string }
> = {
  submit: {
    title: 'Complete the survey',
    description: 'Help us improve Lido Operators by sharing your feedback',
    button: 'Take survey',
  },
  review: {
    title: 'Review the survey',
    description: 'Your setup may have changed since your last submission',
    button: 'Review survey',
  },
};

type SurveyBannerViewProps = {
  variant: SurveyVariant;
  onClose: () => void;
  onClick?: () => void;
};

export const SurveyBannerView: FC<SurveyBannerViewProps> = ({
  variant,
  onClose,
  onClick,
}) => {
  const { title, description, button } = COPY[variant];

  return (
    <Banner
      icon={<IconListCheck />}
      title={title}
      description={description}
      action={
        <Stack direction="row" gap={8} align="center">
          <Button
            href={PATH.SURVEYS}
            size="small"
            onClick={onClick}
            dataTestId={{ root: 'surveysCtaButton' }}
          >
            {button}
          </Button>
          <CloseButton onClick={onClose} aria-label="Close" />
        </Stack>
      }
      dataTestId={{ root: 'surveysCta' }}
    />
  );
};

export const SurveyBanner: FC = () => {
  const { enabled, variant, onClose } = useSurveyEnabled();

  if (!enabled || !variant) return null;

  return (
    <SurveyBannerView
      variant={variant}
      onClick={() => trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.surveysCtaLink)}
      onClose={() => {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.surveysCtaClose);
        onClose();
      }}
    />
  );
};
