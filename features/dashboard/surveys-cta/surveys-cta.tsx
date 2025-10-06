import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Banner, CloseButton, InverseThemeProvider } from 'shared/components';
import { getSurveyDates, useSurveyEnabled } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { formatDate } from 'utils';

export const SurveysCta: FC = () => {
  const { enabled, onClose } = useSurveyEnabled();
  const { end } = getSurveyDates();

  if (!enabled) return null;

  return (
    <Banner
      title="Submit Your Validator Setup"
      variant="wary-dangerous"
      extra={<CloseButton onClick={onClose} />}
    >
      <div>
        Please submit your validator setup data by {formatDate(end, 'MMMM do')}{' '}
        to help enhance the transparency of the Lido Protocol! Go to the{' '}
        <LocalLink href="/surveys">Surveys</LocalLink> tab and fill out the
        &quot;Your Setup&quot; form.
      </div>
      <br />
      <InverseThemeProvider>
        <LocalLink href="/surveys">
          <Button variant="filled" color="secondary" size="sm">
            Submit Setup
          </Button>
        </LocalLink>
      </InverseThemeProvider>
    </Banner>
  );
};
