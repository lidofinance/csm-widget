import { BodyLarge, H3, Stack } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { FormCard } from 'shared/form-page/form-card';
import s from './styles.module.css';

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
    <Stack align="center" gap={8} className={s.cardHeader}>
      {badges}
      <H3 dataTestId={titleTestId ? { root: titleTestId } : undefined}>
        {title}
      </H3>
      <BodyLarge color="secondary">{description}</BodyLarge>
    </Stack>
    {children && (
      <Stack gap={32} className={s.cardBody}>
        {children}
      </Stack>
    )}
  </FormCard>
);
