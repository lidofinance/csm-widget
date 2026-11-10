import {
  Card,
  Description,
  SectionTitle,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';

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
    <Stack direction="column" gap={16}>
      <SectionTitle title={title} subtitle={subtitle} action={tag} />
      {children && (
        <Description as="div" color="secondary">
          {children}
        </Description>
      )}
      {actions && (
        <Stack direction="row" gap={12} wrap>
          {actions}
        </Stack>
      )}
    </Stack>
  </Card>
);
