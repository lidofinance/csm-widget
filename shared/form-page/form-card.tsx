import { Card, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';

export type FormCardProps = PropsWithChildren<{
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  'data-testid'?: string;
}>;

/** Archetype B card: optional title row, then the fields and the inline CTA as children. */
export const FormCard: FC<FormCardProps> = ({
  title,
  description,
  action,
  children,
  'data-testid': testId,
}) => (
  <Card data-testid={testId}>
    <Stack gap={24}>
      {title && (
        <SectionTitle
          title={title}
          subtitle={description}
          action={action}
          dataTestId={{ root: 'formTitle' }}
        />
      )}
      {children}
    </Stack>
  </Card>
);
