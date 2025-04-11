import { Accordion, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ExternalButtonLink } from './external-button-link';
import { useExternalButtons } from './use-external-button';

export const ExternalSection: FC = () => {
  const buttons = useExternalButtons();

  if (buttons.length === 0) return null;

  return (
    <Accordion
      defaultExpanded={false}
      summary={
        <Text as="h2" size="md" weight={800}>
          External dashboards
        </Text>
      }
    >
      <Stack wrap>
        {buttons.map((button) => (
          <ExternalButtonLink key={button.title} {...button} />
        ))}
      </Stack>
    </Accordion>
  );
};
