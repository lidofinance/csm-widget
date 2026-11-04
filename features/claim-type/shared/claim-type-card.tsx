import { H3 } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { FormCard } from 'shared/form-page/form-card';
import { CardBodyStyle, CardDescriptionStyle, CardHeaderStyle } from './styles';

export type ClaimTypeCardProps = PropsWithChildren<{
  badges: ReactNode;
  title: string;
  titleTestId?: string;
  description: ReactNode;
  'data-testid'?: string;
}>;

export const ClaimTypeCard: FC<ClaimTypeCardProps> = ({
  badges,
  title,
  titleTestId,
  description,
  children,
  'data-testid': dataTestId,
}) => (
  <FormCard data-testid={dataTestId}>
    <CardHeaderStyle>
      {badges}
      <H3 dataTestId={titleTestId ? { root: titleTestId } : undefined}>
        {title}
      </H3>
      <CardDescriptionStyle>{description}</CardDescriptionStyle>
    </CardHeaderStyle>
    {children && <CardBodyStyle>{children}</CardBodyStyle>}
  </FormCard>
);
