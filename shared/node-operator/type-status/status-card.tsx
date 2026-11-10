import { Card, SectionTitle } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { Stack } from 'shared/components';

type Props = {
  title: string;
  subtitle?: ReactNode;
  tag: ReactNode;
  children?: ReactNode;
  actions?: ReactNode;
  dataTestId?: string;
};

export const StatusCard: FC<Props> = ({
  title,
  subtitle,
  tag,
  children,
  actions,
  dataTestId,
}) => (
  <Card dataTestId={{ root: dataTestId }}>
    <Stack direction="column" gap="md">
      <SectionTitle title={title} subtitle={subtitle} action={tag} />
      {children}
      {actions && (
        <Stack direction="row" gap="sm" wrap>
          {actions}
        </Stack>
      )}
    </Stack>
  </Card>
);
