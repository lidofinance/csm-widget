import { Button } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Banner, CloseButton, InverseThemeProvider } from 'shared/components';
import { getSurveyDates, useSurveyEnabled } from 'shared/hooks';
import { LocalLink } from 'shared/navigate';
import { formatDate } from 'utils';

export const SurveysCta: FC = () => {
  const { enabled, variant, onClose } = useSurveyEnabled();
  const { end } = getSurveyDates();

  if (!enabled || !variant) return null;

  const isSubmit = variant === 'submit';

  return (
    <Banner
      title={
        isSubmit ? 'Submit Your Validator Setup' : 'Review Your Validator Setup'
      }
      variant={isSubmit ? 'wary-dangerous' : 'wary'}
      extra={<CloseButton onClick={onClose} />}
    >
      <div>
        {isSubmit ? (
          <>
            Please submit your validator setup data by{' '}
            {formatDate(end, 'MMMM do')} to help enhance the transparency of the
            Lido Protocol!
          </>
        ) : (
          <>
            Configuration may have changed since your last survey. Please review
            your setup data by {formatDate(end, 'MMMM do')}.
          </>
        )}{' '}
        Go to the <LocalLink href="/surveys">Surveys</LocalLink> tab
        {isSubmit && <> and fill out the &quot;Your Setup&quot; form</>}.
      </div>
      <br />
      <InverseThemeProvider>
        <LocalLink href="/surveys">
          <Button variant="filled" color="secondary" size="sm">
            {isSubmit ? 'Submit Setup' : 'Review Setup'}
          </Button>
        </LocalLink>
      </InverseThemeProvider>
    </Banner>
  );
};
