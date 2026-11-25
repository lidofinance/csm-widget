import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { Form } from 'shared/hook-form/form-controller';
import s from '../shared/styles.module.css';
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
        <Form className={s.formCardStack}>
          <CurrentClaimerCard />
          <ClaimerFormCard />
        </Form>
      )}
    </Stack>
  );
};
