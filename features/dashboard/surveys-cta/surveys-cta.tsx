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
            {formatDate(end, 'MMMM do')} to help support transparency within the
            Lido Protocol.
          </>
        ) : (
          <>
            The configuration of your setup may have changed since your last
            survey submission. Please review your setup details by{' '}
            {formatDate(end, 'MMMM do')}.
          </>
        )}{' '}
        Navigate to the <LocalLink href="/surveys">Surveys</LocalLink> tab
        {isSubmit ? (
          <> and complete the &quot;Your Setup&quot; form</>
        ) : (
          <> to proceed</>
        )}
        .
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
