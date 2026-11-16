import { Button } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { HubList, HubRow } from 'shared/components';
import { useExternalLinks } from 'shared/hooks';

export const FeedbackRow: FC = () => {
  const { feedbackForm } = useExternalLinks();

  return (
    <HubList>
      <HubRow
        title="Feedback / Bug report form"
        trailing={
          <Button size="small" variant="outline" href={feedbackForm}>
            Add
          </Button>
        }
      />
    </HubList>
  );
};
