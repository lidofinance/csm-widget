import { FC } from 'react';
import { CardStackStyle, FormCardStackStyle } from '../shared/styles';
import { useClaimerFlow } from './context';
import { ClaimerFormCard } from './controls/claimer-form-card';
import { CurrentClaimerCard } from './controls/current-claimer-card';

export const ClaimerFormGate: FC = () => {
  const flow = useClaimerFlow();

  return (
    <CardStackStyle data-testid="claimerForm">
      {flow.action === 'view' ? (
        <CurrentClaimerCard />
      ) : (
        <FormCardStackStyle>
          <CurrentClaimerCard />
          <ClaimerFormCard />
        </FormCardStackStyle>
      )}
    </CardStackStyle>
  );
};
