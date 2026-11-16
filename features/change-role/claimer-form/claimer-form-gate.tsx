import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { FormCardStackStyle } from '../shared/styles';
import { useClaimerFlow } from './context';
import { ClaimerFormCard } from './controls/claimer-form-card';
import { CurrentClaimerCard } from './controls/current-claimer-card';

export const ClaimerFormGate: FC = () => {
  const flow = useClaimerFlow();

  return (
    <Stack gap={24} data-testid="claimerForm">
      {flow.action === 'view' ? (
        <CurrentClaimerCard />
      ) : (
        <FormCardStackStyle>
          <CurrentClaimerCard />
          <ClaimerFormCard />
        </FormCardStackStyle>
      )}
    </Stack>
  );
};
