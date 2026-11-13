import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { StretchCard } from 'shared/components/stretch-stack';

export type FormCardProps = PropsWithChildren<{
  title?: string;
  description?: ReactNode;
  action?: ReactNode;
  tooltip?: ReactNode;
  'data-testid'?: string;
}>;

/** Archetype B card: optional title row, then the fields and the inline CTA as children. */
export const FormCard: FC<FormCardProps> = ({
  title,
  description,
  action,
  tooltip,
  children,
  'data-testid': testId,
}) => (
  <StretchCard data-testid={testId}>
    <Stack gap={24}>
      {title && (
        <SectionTitle
          title={title}
          subtitle={description}
          action={action}
          tooltip={tooltip}
          dataTestId={{
            root: 'formTitle',
            tooltip: 'formTitleTooltip',
            tooltipContent: 'formTitleTooltipContent',
          }}
        />
      )}
      {children}
    </Stack>
  </StretchCard>
);
