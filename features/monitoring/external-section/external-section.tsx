import { FC } from 'react';
import { SectionBlock, Stack, ExternalButtonLink } from 'shared/components';
import { useExternalButtons } from './use-external-button';

export const ExternalSection: FC = () => {
  const buttons = useExternalButtons();

  if (buttons.length === 0) return null;

  return (
    <SectionBlock title="External dashboards">
      <Stack wrap>
        {buttons.map((button) => (
          <ExternalButtonLink key={button.title} {...button} />
        ))}
      </Stack>
    </SectionBlock>
  );
};
