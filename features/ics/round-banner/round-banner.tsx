import { Banner } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ICS_ROUND } from '../shared/consts';

export const RoundBanner: FC = () => (
  <Banner
    dataTestId={{ root: 'roundBanner' }}
    title={`ICS Application Round #${ICS_ROUND.round} is ongoing`}
    description={
      <>
        All applications received after {ICS_ROUND.startDate} will be evaluated
        in {ICS_ROUND.assessedDate}
        {!ICS_ROUND.isPreciseAssessedDate && (
          <>
            . Stay tuned for the announcement of the final date for Application
            Round #{ICS_ROUND.round}.
          </>
        )}
      </>
    }
  />
);
