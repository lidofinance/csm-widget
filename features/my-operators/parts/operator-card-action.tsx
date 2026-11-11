import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { OperatorRef, useNodeOperator } from 'modules/web3';
import { isSameOperator, SwitchToOperatorButton } from 'shared/node-operator';
import { FC } from 'react';
import { trackMatomoEvent } from 'utils';

type Props = {
  operator: OperatorRef;
  matomoSwitch: MATOMO_CLICK_EVENTS_TYPES;
};

export const OperatorCardAction: FC<Props> = ({ operator, matomoSwitch }) => {
  const { nodeOperator } = useNodeOperator();

  if (isSameOperator(operator, nodeOperator)) {
    return (
      <Button
        href={PATH.HOME}
        variant="outline"
        size="small"
        fullWidth
        onClick={() =>
          trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.myOperatorsDashboard)
        }
        dataTestId={{ root: 'goToDashboardBtn' }}
      >
        View dashboard
      </Button>
    );
  }

  return (
    <SwitchToOperatorButton
      operator={operator}
      path={PATH.HOME}
      matomoEvent={matomoSwitch}
    >
      Switch to this Operator
    </SwitchToOperatorButton>
  );
};
