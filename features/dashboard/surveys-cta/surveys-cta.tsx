import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { FC, useCallback } from 'react';
import { Banner, CloseButton, InverseThemeProvider } from 'shared/components';
import { getSurveyDates, useSurveyEnabled } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { formatDate, trackMatomoEvent } from 'utils';

type SurveysCtaContentProps = {
  endDate: Date;
};

const SurveysCtaSubmit: FC<SurveysCtaContentProps> = ({ endDate }) => (
  <>
    <div>
      Please submit your validator setup data by{' '}
      {formatDate(endDate, 'MMMM do')} to help support transparency within the
      Lido Protocol. Navigate to the{' '}
      <LocalLink
        href={PATH.SURVEYS}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.surveysCtaLink}
      >
        Surveys
      </LocalLink>{' '}
      tab and complete the &quot;Your Setup&quot; form.
    </div>
    <br />
    <InverseThemeProvider>
      <LocalLink
        href={PATH.SURVEYS}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.surveysCtaLink}
      >
        <Button variant="filled" color="secondary" size="sm">
          Submit Setup
        </Button>
      </LocalLink>
    </InverseThemeProvider>
  </>
);

const SurveysCtaReview: FC<SurveysCtaContentProps> = ({ endDate }) => (
  <>
    <div>
      The configuration of your setup may have changed since your last survey
      submission. Please review your setup details by{' '}
      {formatDate(endDate, 'MMMM do')}. Navigate to the{' '}
      <LocalLink
        href={PATH.SURVEYS}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.surveysCtaLink}
      >
        Surveys
      </LocalLink>{' '}
      tab to proceed.
    </div>
    <br />
    <InverseThemeProvider>
      <LocalLink
        href={PATH.SURVEYS}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.surveysCtaLink}
      >
        <Button variant="filled" color="secondary" size="sm">
          Review Setup
        </Button>
      </LocalLink>
    </InverseThemeProvider>
  </>
);

export const SurveysCta: FC = () => {
  const { enabled, variant, onClose } = useSurveyEnabled();
  const { end } = getSurveyDates();

  const handleClose = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.surveysCtaClose);
    onClose();
  }, [onClose]);

  if (!enabled || !variant) return null;

  const isSubmit = variant === 'submit';
  const BannerContent = isSubmit ? SurveysCtaSubmit : SurveysCtaReview;

  return (
    <Banner
      title={
        isSubmit ? 'Submit Your Validator Setup' : 'Review Your Validator Setup'
      }
      variant={isSubmit ? 'wary-dangerous' : 'wary'}
      extra={<CloseButton onClick={handleClose} />}
    >
      <BannerContent endDate={end} />
    </Banner>
  );
};
