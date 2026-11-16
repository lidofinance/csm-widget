import { Switch, Typography } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren } from 'react';
import { FormCard } from 'shared/form-page';
import { getTopUpCopy } from './top-up-state';

export type TopUpCardProps = PropsWithChildren<{ enabled: boolean }>;

export const TopUpCard: FC<TopUpCardProps> = ({ enabled, children }) => (
  <FormCard title="Top-ups">
    {children}
    <Typography color="secondary" variant="body" as="p">
      {getTopUpCopy(enabled).description}
    </Typography>
  </FormCard>
);

export const TopUpLockedCard: FC = () => (
  <TopUpCard enabled={false}>
    <Switch
      checked={false}
      disabled
      readOnly
      label={getTopUpCopy(false).status}
    />
  </TopUpCard>
);
