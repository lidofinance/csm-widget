import { FC } from 'react';
import { SectionBlock, Stack, ExternalButtonLink } from 'shared/components';
import { NOTIFICATION_TOOLS_BUTTONS } from './notification-tools-buttons';

export const NotificationToolsSection: FC = () => {
  if (NOTIFICATION_TOOLS_BUTTONS.length === 0) return null;

  return (
    <SectionBlock title="Notification Tools">
      <Stack wrap>
        {NOTIFICATION_TOOLS_BUTTONS.map((button) => (
          <ExternalButtonLink key={button.title} {...button} />
        ))}
      </Stack>
    </SectionBlock>
  );
};
