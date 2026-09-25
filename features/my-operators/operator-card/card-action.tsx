import { Button } from '@lidofinance/lido-ui';
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
          fullwidth
          size="sm"
          variant="outlined"
          color="primary"
          data-testid="goToDashboardBtn"
        >
          Go to dashboard
        </Button>
      </LocalLink>
    );
  }

  return (
    <SwitchToOperatorButton
      operator={operator}
      path={PATH.HOME}
      variant="outlined"
      color="primary"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.myOperatorsSwitch}
    >
      Switch
    </SwitchToOperatorButton>
  );
};
