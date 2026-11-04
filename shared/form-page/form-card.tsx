import { SectionTitle } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { FormCardStyle } from './styles';

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
  <FormCardStyle data-testid={testId}>
    {title && (
      <SectionTitle
        title={title}
        subtitle={description}
        action={action}
        dataTestId={{ root: 'formTitle' }}
      />
    )}
    {children}
  </FormCardStyle>
);
