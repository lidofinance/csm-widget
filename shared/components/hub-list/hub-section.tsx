import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';

export type HubSectionProps = PropsWithChildren<{
  title: string;
  subtitle?: ReactNode;
  tooltip?: ReactNode;
  action?: ReactNode;
  dataTestId?: string;
}>;

export const HubSection: FC<HubSectionProps> = ({
  title,
  subtitle,
  tooltip,
  action,
  dataTestId,
  children,
}) => (
  <Stack as="section" gap={16} dataTestId={{ root: dataTestId }}>
    <SectionTitle
      size="large"
      title={title}
      subtitle={subtitle}
      tooltip={tooltip}
      action={action}
    />
    {children}
  </Stack>
);
