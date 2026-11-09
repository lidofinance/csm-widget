import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { OperatorRef, useNodeOperator } from 'modules/web3';
import { FC } from 'react';
import { LocalLink } from 'shared/navigate';
import { SwitchToOperatorButton } from 'shared/node-operator/switch-to-operator-button/switch-to-operator-button';
import { isSameOperator } from 'shared/node-operator/utils';

export const CardAction: FC<{ operator: OperatorRef }> = ({ operator }) => {
  const { nodeOperator } = useNodeOperator();
  const isActive = isSameOperator(operator, nodeOperator);

  if (isActive) {
    return (
      <LocalLink
        href={PATH.HOME}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.myOperatorsDashboard}
      >
        <Button
          fullWidth
          size="small"
          variant="outline"
          dataTestId={{ root: 'goToDashboardBtn' }}
        >
          Go to dashboard
        </Button>
      </LocalLink>
    );
  }

  return (
    <SwitchToOperatorButton
      operator={operator}
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.myOperatorsSwitch}
    >
      Switch
    </SwitchToOperatorButton>
  );
};
