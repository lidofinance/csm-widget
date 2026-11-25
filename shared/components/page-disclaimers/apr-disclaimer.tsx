import { Disclaimer } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

export const AprDisclaimer: FC = () => (
  <Disclaimer data-testid="aprDisclaimer">
    *All APR values and rewards referenced on this page are estimates based on
    current conditions and may vary. Nothing here guarantees future rewards.
    Penalties may apply. Do your own research before engaging.
  </Disclaimer>
);
